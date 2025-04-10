import os
import re
from pathlib import Path
from typing import List, Callable, Optional
import nest_asyncio
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import Field
import diskcache
from dotenv import load_dotenv

from llama_index.core import (
    Settings,
    StorageContext,
    VectorStoreIndex,
    load_index_from_storage,
)
from llama_index.core.query_engine import CustomQueryEngine
from llama_index.core.retrievers import BaseRetriever
from llama_index.core.schema import ImageNode, NodeWithScore, MetadataMode, TextNode
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.core.prompts import PromptTemplate
from llama_parse import LlamaParse
from llm_guard.input_scanners import Toxicity, TokenLimit
from llm_guard.input_scanners.toxicity import MatchType
from litellm import completion
from llama_index.core.base.response.schema import Response

nest_asyncio.apply()

# Load environment variables from .env file
load_dotenv()

# Access the variables
LLAMACLOUD_API_KEY = os.environ.get("LLAMACLOUD_API_KEY")
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
os.environ["GEMINI_API_KEY"] = GOOGLE_API_KEY

# Embedding Model
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

# LLM for Query Generation and Scanner Responses
llm = GoogleGenAI(model_name="models/gemini-2.0-flash")
Settings.llm = llm

# Cache Setup
CACHE_DIR = "_data/cache"
if not os.path.exists(CACHE_DIR):
    os.makedirs(CACHE_DIR)
query_cache = diskcache.Cache(CACHE_DIR)

QA_PROMPT_TMPL = """\
---------------------
{context_str}
---------------------
Given the context information and not prior knowledge, answer the query if it is related to the context.
If the query is not related to the context. Respond with:
"I'm sorry, but I can't help with that."

YOU HAVE TO CITE THE EXACT DATA AND INCLUDE EXACT TEXT FROM THE CONTEXT.
DO NOT MAKE UP ANYTHING.
"""
QA_PROMPT = PromptTemplate(QA_PROMPT_TMPL)


# Function to Parse Documents
def parse_document(file_path: str, llamaAPI_KEY: str):
    """
    Parses a document (currently PDF) using LlamaParse, extracting
    both text and images.

    Args:
        file_path (str): Path to the document.
        llamaAPI_KEY (str): API key for LlamaCloud/LlamaParse.

    Returns:
        tuple: A tuple containing:
            - docs_text (list): List of documents with regular text.
            - md_json_list (list): List of markdown-formatted JSON objects.
            - image_dicts (dict): Dictionary containing image information.
    """
    parser_text = LlamaParse(result_type="text", api_key=llamaAPI_KEY)
    parser_gpt4o = LlamaParse(
        result_type="markdown", gpt4o_mode=True, api_key=llamaAPI_KEY
    )

    print(f"Parsing text...")
    docs_text = parser_text.load_data(file_path)
    print(f"Parsing PDF file...")
    md_json_objs = parser_gpt4o.get_json_result(file_path)
    md_json_list = md_json_objs[0]["pages"]
    image_dicts = parser_gpt4o.get_images(
        md_json_objs, download_path=IMAGE_DIRECTORY  # Use global IMAGE_DIRECTORY here
    )

    return docs_text, md_json_list, image_dicts


# Helper Functions for Text Node Processing
def get_page_number(file_name):
    match = re.search(r"-page-(\d+)\.jpg$", str(file_name))
    if match:
        return int(match.group(1))
    return 0


def _get_sorted_image_files(image_dir):
    raw_files = [f for f in list(Path(image_dir).iterdir()) if f.is_file()]
    sorted_files = sorted(raw_files, key=get_page_number)
    return sorted_files


# Function to Create Text Nodes
def get_text_nodes(docs, image_dir=None, json_dicts=None, max_metadata_len=512):
    nodes = []

    image_files = _get_sorted_image_files(image_dir) if image_dir is not None else None

    md_texts = [d["md"] for d in json_dicts] if json_dicts is not None else None

    doc_chunks = [c for d in docs for c in d.text.split("---")]

    for idx, doc_chunk in enumerate(doc_chunks):
        chunk_metadata = {"page_num": idx + 1}

        if image_files is not None:
            image_file = image_files[idx] if idx < len(image_files) else image_files[0]
            chunk_metadata["image_path"] = str(image_file)

        if md_texts is not None:
            parsed_text_md = md_texts[idx] if idx < len(md_texts) else md_texts[0]
            # Truncate markdown text if it exceeds the limit
            if parsed_text_md and len(parsed_text_md) > max_metadata_len:
                parsed_text_md = (
                    parsed_text_md[:max_metadata_len] + "..."
                )  # Truncate and add ellipsis
            chunk_metadata["parsed_text_markdown"] = parsed_text_md

        # Truncate the document chunks if it exceeds the limit
        if doc_chunk and len(doc_chunk) > max_metadata_len:
            doc_chunk = doc_chunk[:max_metadata_len] + "..."

        chunk_metadata["parsed_text"] = doc_chunk

        node = TextNode(
            text="",
            metadata=chunk_metadata,
        )
        nodes.append(node)

    return nodes


# Guardrail Functions (Scanner Functions)
def result_response(
    guardrail_type,
    activated,
    guard_output,
    is_valid,
    risk_score,
    threshold,
    response_text,
):
    return {
        "guardrail_type": guardrail_type,
        "activated": activated,
        "guardrail_detail": {
            "guard_output": guard_output,
            "is_valid": is_valid,
            "risk_score/threshold": f"{risk_score}/{threshold}",
            "response_text": response_text,
        },
    }


def guardrail_toxicLanguage(prompt):
    # Interact with the LLM to generate a response
    print(f"Prompt: {prompt}")

    # Generate the response using the LLM (Gemini-1.5-flash)
    response = completion(
        model="gemini/gemini-1.5-flash",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
    )
    response_text = response.choices[0].message.content

    # Define the threshold and scan for toxicity
    threshold = 0.5
    toxic_scanner = Toxicity(threshold=threshold, match_type=MatchType.FULL)
    sanitized_output, is_valid, risk_score = toxic_scanner.scan(prompt)

    return result_response(
        guardrail_type="Toxicity",
        activated=not is_valid,
        guard_output=sanitized_output,
        is_valid=is_valid,
        risk_score=risk_score,
        threshold=threshold,
        response_text=response_text,
    )


def guardrail_tokenlimit(prompt):
    threshold = 400
    response = completion(
        model="gemini/gemini-1.5-flash",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ],
    )
    response_text = response.choices[0].message.content

    scanner = TokenLimit(limit=threshold, encoding_name="cl100k_base")
    sanitized_output, is_valid, risk_score = scanner.scan(prompt)

    # Use the global rail to format the result
    result = result_response(
        guardrail_type="Token limit",
        activated=not is_valid,
        guard_output=sanitized_output,
        is_valid=is_valid,
        risk_score=risk_score,
        threshold=threshold,
        response_text=response_text,
    )

    return result


# Input and Output Scanner functions
def InputScanner(query, listOfScanners):
    detected = False
    triggered_scanners = []

    for scanner in listOfScanners:
        result = scanner(query)

        if result["activated"]:
            detected = True
            triggered_scanners.append(result)

    return detected, triggered_scanners


def OutputScanner(response, query, context, listOfScanners):
    detected = False
    triggered_scanners = []

    for scanner in listOfScanners:
        if scanner.__name__ == "evaluate_rag_response":
            result = scanner(response, query, context)
        else:
            result = scanner(response)

        if result["activated"]:
            detected = True
            triggered_scanners.append(result)

    return detected, triggered_scanners


# Custom Query Engine
class MultimodalQueryEngine(CustomQueryEngine):
    qa_prompt: PromptTemplate
    retriever: BaseRetriever
    multi_modal_llm: GoogleGenAI
    input_scanners: List[Callable[[str], dict]] = Field(default_factory=list)
    output_scanners: List[Callable[[str], dict]] = Field(default_factory=list)

    def __init__(self, qa_prompt: Optional[PromptTemplate] = None, **kwargs) -> None:
        super().__init__(qa_prompt=qa_prompt or QA_PROMPT, **kwargs)

    def custom_query(self, query_str: str):
        query_metadata = {
            "input_scanners": [],
            "output_scanners": [],
            "retrieved_nodes": [],
            "response_status": "success",
        }

        input_detected, input_triggered = InputScanner(query_str, self.input_scanners)
        if input_triggered:
            query_metadata["input_scanners"] = input_triggered
            if input_detected:
                return Response(
                    response="I'm sorry, but I can't help with that.",
                    source_nodes=[],
                    metadata={
                        "guardrail": "Input Scanner",
                        "triggered_scanners": input_triggered,
                        "response_status": "blocked",
                    },
                )

        # retrieve text nodes
        nodes = self.retriever.retrieve(query_str)
        # create ImageNode items from text nodes
        image_nodes = [
            NodeWithScore(node=ImageNode(image_path=n.metadata["image_path"]))
            for n in nodes
        ]

        # create context string from text nodes, dump into the prompt
        context_str = "\n\n".join(
            [r.get_content(metadata_mode=MetadataMode.LLM) for r in nodes]
        )
        fmt_prompt = self.qa_prompt.format(context_str=context_str, query_str=query_str)

        # synthesize an answer from formatted text and images
        llm_response = self.multi_modal_llm.complete(
            prompt=fmt_prompt,
            image_documents=[image_node.node for image_node in image_nodes],
        )

        # Step 5: Run Output Scanners
        output_detected, output_triggered = OutputScanner(
            str(llm_response),
            str(query_str),
            str(context_str),
            self.output_scanners,
        )
        if output_triggered:
            query_metadata["output_scanners"] = (
                output_triggered  # Store output scanner info
            )

        final_response = str(llm_response)
        if output_detected:
            final_response = "I'm sorry, but I can't help with that."
            query_metadata["response_status"] = "sanitized"
        # Return the response with detailed metadata
        return Response(
            response=final_response,
            source_nodes=nodes,
            metadata=query_metadata,
        )


# Helper function to calculate confidence score
def get_confidence_score(response, index):
    """Calculates confidence score based on cited pages."""

    cited_pages = []
    for match in re.finditer(r"\(Page (\d+)\)", response.response):
        cited_pages.append(int(match.group(1)))

    relevant_nodes = [
        node
        for node in index.docstore.get_nodes()
        if node.metadata.get("page_num") in cited_pages
    ]

    if not relevant_nodes:
        return 0.0  # No cited pages found

    response_embedding = embed_model.get_text_embedding(response.response)
    node_embeddings = [
        embed_model.get_text_embedding(node.get_content()) for node in relevant_nodes
    ]

    similarity_scores = cosine_similarity([response_embedding], node_embeddings)[0]

    confidence_score = similarity_scores.mean()

    return confidence_score


class RAGPipeline:
    def __init__(
        self,
        storage_dir: str = "_data/vector",
        image_dir: str = "_data/data_images",
        llama_api_key: str = LLAMACLOUD_API_KEY,
        google_api_key: str = GOOGLE_API_KEY,
        input_scanners: List[Callable[[str], dict]] = None,
        output_scanners: List[Callable[[str], dict]] = None,
        max_metadata_len: int = 512,  # Add this line
    ):
        """
        Initializes the RAG pipeline.

        Args:
            storage_dir (str): Directory to store/load the index.
            image_dir (str): Directory to store images.
            llama_api_key (str): LlamaParse API key.
            google_api_key (str): Google API key.
            input_scanners (list): List of input scanner functions.
            output_scanners (list): List of output scanner functions.
            max_metadata_len (int): Limit on metadata length.
        """
        self.storage_dir = storage_dir
        self.image_dir = image_dir
        self.llama_api_key = llama_api_key
        self.google_api_key = google_api_key
        self.input_scanners = input_scanners or [
            guardrail_toxicLanguage,
            guardrail_tokenlimit,
        ]  # Default input scanners
        self.output_scanners = output_scanners or [
            guardrail_toxicLanguage
        ]  # Default output scanners
        self.max_metadata_len = max_metadata_len
        # Create the directories
        if not os.path.exists(self.storage_dir):
            os.makedirs(self.storage_dir)
        if not os.path.exists(self.image_dir):
            os.makedirs(self.image_dir)

        self.index = None  # Will be loaded or created in ingest_data

        # Set environment variables (important for LlamaParse)
        os.environ["GOOGLE_API_KEY"] = self.google_api_key
        os.environ["GEMINI_API_KEY"] = self.google_api_key

        # LLM Initialization (Moved here to ensure proper initialization)
        self.llm = GoogleGenAI(model_name="models/gemini-2.0-flash")
        Settings.llm = self.llm

        # Set up multi-modal LLM
        self.gemini_multimodal = GoogleGenAI(model_name="models/gemini-2.0-flash")

        # Embedding Model
        self.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

    def ingest_data(self, data_dir: str):
        """
        Ingests all PDF files from the given directory into the RAG pipeline.
        """
        pdf_files = [f for f in Path(data_dir).glob("*.pdf")]

        if not pdf_files:
            print(f"No PDF files found in {data_dir}")
            return

        # Load existing index or create a new one
        try:
            if os.path.exists(self.storage_dir):
                print(f"Loading existing index from {self.storage_dir}")
                storage_context = StorageContext.from_defaults(
                    persist_dir=self.storage_dir
                )
                self.index = load_index_from_storage(
                    storage_context,
                    index_id="vector_index",
                    embed_model=self.embed_model,
                )
            else:
                print("Creating a new index...")
                self.index = None  # Start with an empty index
                # Ensure the directory exists
                os.makedirs(self.storage_dir, exist_ok=True)

        except Exception as e:
            print(f"Error loading or creating index: {e}")
            self.index = None

        # Track already ingested files using a simple file-based approach
        ingested_files_path = os.path.join(self.storage_dir, "ingested_files.txt")
        ingested_files = set()

        # Load list of already ingested files if it exists
        if os.path.exists(ingested_files_path):
            with open(ingested_files_path, "r") as f:
                ingested_files = set(line.strip() for line in f.readlines())

        # Ingest new documents
        newly_ingested = False
        for pdf_file in pdf_files:
            file_path_str = str(pdf_file)
            if file_path_str in ingested_files:
                print(f"Skipping already ingested file: {pdf_file}")
                continue

            print(f"Processing file: {pdf_file}")
            try:
                # Parse document
                docs_text, md_json_list, _ = parse_document(
                    file_path_str, self.llama_api_key
                )

                # Create the image directory if it doesn't exist
                data_images_path = Path(self.image_dir)
                data_images_path.mkdir(parents=True, exist_ok=True)

                # Get text nodes
                text_nodes = get_text_nodes(
                    docs_text,
                    image_dir=self.image_dir,
                    json_dicts=md_json_list,
                    max_metadata_len=self.max_metadata_len,
                )

                # Add file name metadata to each node
                for node in text_nodes:
                    node.metadata["file_name"] = file_path_str

                if self.index is None:
                    print("Creating a fresh index...")
                    self.index = VectorStoreIndex(
                        text_nodes, embed_model=self.embed_model
                    )
                    self.index.set_index_id("vector_index")
                else:
                    print("Updating existing index...")
                    # Add nodes to existing index - use insert_nodes instead of insert
                    self.index.insert_nodes(text_nodes)

                # Mark this file as ingested
                ingested_files.add(file_path_str)
                newly_ingested = True

            except Exception as e:
                print(f"Error processing file {pdf_file}: {e}")
                continue

        # Save the updated index to disk if any new files were ingested
        if newly_ingested:
            try:
                self.index.storage_context.persist(self.storage_dir)
                print(f"Index saved to {self.storage_dir}")

                # Update the list of ingested files
                with open(ingested_files_path, "w") as f:
                    for file_path in ingested_files:
                        f.write(f"{file_path}\n")

            except Exception as e:
                print(f"Error saving index to disk: {e}")

    def query(self, query_str: str):
        """
        Queries the RAG pipeline with the given query string.

        Args:
            query_str (str): The query string.

        Returns:
            Response: The response object from the query engine.
        """
        if self.index is None:
            raise ValueError("Index not initialized.  Call ingest_data() first.")

        cached_response = query_cache.get(query_str)
        if cached_response:
            print("Loading response from cache...")
            return cached_response

        query_engine = MultimodalQueryEngine(
            retriever=self.index.as_retriever(similarity_top_k=9),
            multi_modal_llm=self.gemini_multimodal,
            input_scanners=self.input_scanners,
            output_scanners=self.output_scanners,
        )

        response = query_engine.query(query_str)

        query_cache.set(query_str, response, expire=3600)  # Cache for 1 hour

        return response

    def get_confidence_score(self, response: Response):
        """
        Calculates the confidence score for a given response.
        """
        if self.index is None:
            raise ValueError("Index not initialized. Call ingest_data() first.")
        return get_confidence_score(response, self.index)


# Global variables
RAG_PIPELINE = None  # Global RAG pipeline instance
DATA_DIRECTORY = "_data/files"  # Global data directory
VECTOR_DIRECTORY = "_data/vector"  # Global vector directory
IMAGE_DIRECTORY = "_data/data_images"  # New global image directory


def initialize_rag_pipeline():
    """Initializes the RAG pipeline, loading from storage if it exists."""
    global RAG_PIPELINE

    if RAG_PIPELINE is None:
        # Ensure vector directory exists
        if not os.path.exists(VECTOR_DIRECTORY):
            os.makedirs(VECTOR_DIRECTORY)

        # Ensure image directory exists
        if not os.path.exists(IMAGE_DIRECTORY):
            os.makedirs(IMAGE_DIRECTORY)

        RAG_PIPELINE = RAGPipeline(
            storage_dir=VECTOR_DIRECTORY, image_dir=IMAGE_DIRECTORY
        )  # Instantiate with the image directory

        # Check if the index already exists
        if os.path.exists(RAG_PIPELINE.storage_dir):
            print("Loading existing index...")
        else:
            print("No existing index found. Ingesting data for the first time...")
            ingest()  # Call ingest here to create the initial index
        print("RAG pipeline initialized.")


def ingest():
    """Ingests data into the RAG pipeline."""
    global RAG_PIPELINE

    if RAG_PIPELINE is None:
        initialize_rag_pipeline()

    try:
        print("Ingesting Data...")
        RAG_PIPELINE.ingest_data(DATA_DIRECTORY)
        print("Ingestion complete.")
    except Exception as e:
        print(f"Error during ingestion: {e}")


def query(question: str):
    """
    Queries the RAG pipeline and returns the response with source traceability information.

    Args:
        question (str): The query string.

    Returns:
        tuple: (response_text, confidence_score, source_files_urls)
            - response_text (str): The text response
            - confidence_score (float): Confidence score of the response
            - source_files_urls (list): List of source files with URLs
    """
    global RAG_PIPELINE

    if RAG_PIPELINE is None:
        initialize_rag_pipeline()

    try:
        print(f"Querying with question: {question}")

        # Check for cached response
        cached_response = query_cache.get(question)
        if cached_response:
            print("Loading response from cache...")
            return (
                cached_response["response"],
                cached_response["confidence"],
                cached_response["source_files"],
            )

        response = RAG_PIPELINE.query(question)

        # Extract source files information
        source_files = []
        if hasattr(response, "source_nodes") and response.source_nodes:
            for node in response.source_nodes:
                if hasattr(node, "metadata") and node.metadata:
                    # Extract image path if available
                    image_path = node.metadata.get("image_path", "")
                    page_num = node.metadata.get("page_num", "unknown")
                    file_name = node.metadata.get("file_name", "unknown")

                    # Create a source entry with available information
                    source_entry = f"Page {page_num}"
                    if file_name != "unknown":
                        source_entry += f" from {os.path.basename(file_name)}"

                    if image_path:
                        # Only add if this image path hasn't been added yet
                        source_info = f"{source_entry}: {image_path}"
                        if source_info not in source_files:
                            source_files.append(source_info)

        # Create the response text
        response_text = str(response)

        # Parse source files and convert paths to URLs
        source_files_urls = []
        for source in source_files:
            # Extract the file path part (after the colon)
            parts = source.split(": ")
            if len(parts) > 1:
                source_info = parts[0]
                file_path = parts[1].strip()

                # Convert the file path to a URL
                url = f"http://localhost:8000/data_images/{Path(file_path).name}"
                source_files_urls.append(f"{source_info}: {url}")
            else:
                # If there's no colon, just add the source as is
                source_files_urls.append(source)

        print(f"Response: {response_text}")
        print(f"Metadata: {response.metadata}")
        print(f"Source files: {source_files_urls}")

        # Get confidence score
        confidence = 1

        # Cache the response, confidence, and source files
        query_cache.set(
            question,
            {
                "response": response_text,
                "confidence": confidence,
                "source_files": source_files_urls,
            },
            expire=3600,
        )  # Cache for 1 hour

        return response_text, confidence, source_files_urls
    except Exception as e:
        print(f"Error during query: {e}")
        return f"Error processing query: {str(e)}", 0, []

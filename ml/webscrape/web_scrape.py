import os
from langchain_core.messages import AIMessage, HumanMessage
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_cohere import CohereEmbeddings
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

# Load environment variables from .env file
load_dotenv()

if not os.getenv("COHERE_API_KEY"):
    raise ValueError("COHERE_API_KEY not found in environment variables.")
if not os.getenv("GROQ_API_KEY"):
    raise ValueError("GROQ_API_KEY not found in environment variables.")

memory = {
    "vector_store": None,
}


def get_vectorstore():
    """Loads, splits, and creates a vector store from a fixed web URL using Cohere embeddings."""
    fixed_url = "https://jobsforherfoundation.org/"
    loader = WebBaseLoader(fixed_url)
    document = loader.load()

    text_splitter = RecursiveCharacterTextSplitter()
    document_chunks = text_splitter.split_documents(document)

    embeddings = CohereEmbeddings(model="embed-english-v3.0")
    vector_store = Chroma.from_documents(document_chunks, embeddings)

    print(f"Vector store created with {len(document_chunks)} chunks from {fixed_url}")
    return vector_store


def get_context_retriever_chain(vector_store):
    """Creates a retriever chain using Groq Llama3.1 without history."""
    llm = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant")
    retriever = vector_store.as_retriever()

    prompt = ChatPromptTemplate.from_messages(
        [
            ("user", "{input}"),
            (
                "user",
                "Generate a search query to look up in order to get information relevant to the user input above.",
            ),
        ]
    )

    return create_history_aware_retriever(llm, retriever, prompt)


def get_conversational_rag_chain(retriever_chain):
    """Creates the main conversational RAG chain without using chat history."""
    llm = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant")

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "Answer the user's questions based on the below context:\n\n{context}",
            ),
            ("user", "{input}"),
        ]
    )

    stuff_documents_chain = create_stuff_documents_chain(llm, prompt)
    return create_retrieval_chain(retriever_chain, stuff_documents_chain)


def setup():
    """Initializes the vector store for the chat session."""
    print("Setting up vector store...")
    memory["vector_store"] = get_vectorstore()
    print("Setup complete.")


def chat(user_input):
    """Handles a single turn of the chat (no history used)."""
    if memory["vector_store"] is None:
        return "Error: Vector store not initialized. Please run setup first."

    retriever_chain = get_context_retriever_chain(memory["vector_store"])
    conversation_rag_chain = get_conversational_rag_chain(retriever_chain)

    response = conversation_rag_chain.invoke({"input": user_input})

    return response["answer"]


# Example usage
if __name__ == "__main__":
    website_url = input("Enter the website URL to chat with: ").strip()
    if not website_url.startswith(("http://", "https://")):
        website_url = "https://" + website_url  # Basic URL correction

    try:
        setup()

        print("\nChat initialized with Cohere Embeddings and Llama3.1 on Groq.")
        print("Using context from:", website_url)
        print("Type 'exit' to stop.\n")

        while True:
            query = input("You: ")
            if query.lower() == "exit":
                print("Bot: Goodbye!")
                break
            reply = chat(query)
            print("Bot:", reply)

    except Exception as e:
        print(f"\nAn error occurred: {e}")
        print(
            "Please ensure the URL is valid and accessible, and your API keys are correct."
        )

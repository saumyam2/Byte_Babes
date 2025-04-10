from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import sqlite3
from constants import DB_PATH
from rag.rag_service import query, ingest  # Import the functions directly

router = APIRouter(prefix="/rag", tags=["rag"])


class QueryRequest(BaseModel):
    question: str

    class Config:
        schema_extra = {
            "example": {"question": "What are the areas of improvement in my resume?"}
        }


class QueryResponse(BaseModel):
    response: str
    confidence: float
    metadata: Dict[Any, Any]


@router.post("/ingest")
async def ingest_data_endpoint():
    """
    Ingest data from the specified directory into the RAG pipeline.

    Args:
        current_user: Currently authenticated user (from JWT token)

    Returns:
        A success message upon successful ingestion.
    """
    try:
        # Path to your PDF files

        # Call the ingest_data function from the service
        ingest()

        return {"message": "Data ingestion completed successfully."}

    except Exception as e:
        print(f"Error during data ingestion: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Error during data ingestion: {str(e)}"
        )


@router.post("/query", response_model=QueryResponse)
async def process_query(
    request: QueryRequest,
):
    """
    Process a RAG query and return the response with confidence score.

    Args:
        request: QueryRequest containing the question
        current_user: Currently authenticated user (from JWT token)

    Returns:
        QueryResponse containing:
        - response: Generated answer to the question
        - confidence: Confidence score of the response
        - metadata: Additional metadata about the response
    """
    try:
        # Call the query function from the service
        response, confidence, source_files = query(request.question)
        print(
            f"Response: {response}, Confidence: {confidence}, Source Files: {source_files}"
        )
        # Log the query attempt
        # log_query_attempt(
        #     current_user,
        #     request.question,
        #     response.response,
        #     confidence
        # )

        return QueryResponse(
            response=response,
            confidence=confidence,
            metadata={
                "source_files": source_files
            },  # Include the source files in metadata
        )

    except Exception as e:
        print(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

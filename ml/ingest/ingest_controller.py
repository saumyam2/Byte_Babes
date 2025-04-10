from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from .ingest_service import IngestService

router = APIRouter()
service = IngestService()


class KnowledgeSourceCreate(BaseModel):
    file_urls: List[str]  # Updated to match DB schema


class KnowledgeSourceUpdate(BaseModel):
    file_urls: Optional[List[str]] = None


@router.post("/knowledge-sources")
async def create_knowledge_source(source: KnowledgeSourceCreate):
    source_ids = service.create_knowledge_source(file_urls=source.file_urls)
    return {"ids": source_ids, "message": "Knowledge sources created successfully"}


@router.get("/knowledge-sources")
async def get_knowledge_sources():
    sources = service.get_knowledge_sources()
    return {"data": sources}


@router.put("/knowledge-sources/{source_id}")
async def update_knowledge_source(source_id: int, source: KnowledgeSourceUpdate):
    success = service.update_knowledge_source(
        source_id=source_id, file_urls=source.file_urls
    )
    if not success:
        raise HTTPException(status_code=404, detail="Knowledge source not found")
    return {"message": "Knowledge source updated successfully"}


@router.delete("/knowledge-sources/{source_id}")
async def delete_knowledge_source(source_id: int):
    success = service.delete_knowledge_source(source_id)
    if not success:
        raise HTTPException(status_code=404, detail="Knowledge source not found")
    return {"message": "Knowledge source deleted successfully"}

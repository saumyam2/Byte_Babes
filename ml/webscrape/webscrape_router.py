from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from webscrape.web_scrape import chat


class ChatRequest(BaseModel):
    message: str


router = APIRouter(tags=["webscrape"])


@router.post("/webscrape")
async def scrape(request: ChatRequest):
    try:
        response = chat(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

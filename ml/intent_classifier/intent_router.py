from fastapi import APIRouter
from pydantic import BaseModel
from intent_client import classify_intent

router = APIRouter()

class IntentRequest(BaseModel):
    message: str

@router.post("/classify-intent/")
async def get_intent(req: IntentRequest):
    intent = classify_intent(req.message)
    return {"intent": intent}

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from .continuous_learning_service import format_prompt_for_continuous_learning

router = APIRouter(tags=["continuous_learning"])


class ConversationEntry(BaseModel):
    sender: str
    message: str


class Session(BaseModel):
    category: str
    details: str
    conversation: List[ConversationEntry]


class ContinuousLearningRequest(BaseModel):
    sessions: List[Session]


@router.post("/continuous-learning")
async def generate_continuous_learning_prompt(request: ContinuousLearningRequest):
    # Convert Pydantic models to plain Python dicts
    session_dicts = [session.dict() for session in request.sessions]
    result = format_prompt_for_continuous_learning(session_dicts)
    return result

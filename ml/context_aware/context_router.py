from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from context_client import get_chat_response
import uuid

router = APIRouter()

class UserMessage(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_bot(user_message: UserMessage):
    try:
        session_id = str(uuid.uuid4())  # or retrieve from user/session
        response = get_chat_response(user_message.message, session_id)
        return JSONResponse(content={"response": response})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

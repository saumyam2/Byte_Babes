from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from context_client import get_chat_response

router = APIRouter()

class UserMessage(BaseModel):
    message: str

@router.post("/chat")
async def chat_with_bot(user_message: UserMessage):
    try:
        response = get_chat_response(user_message.message)
        return JSONResponse(content={"response": response})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

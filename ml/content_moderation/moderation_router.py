from fastapi import APIRouter
from content_moderation.moderation_client import check_toxicity, check_content_with_llm
from pydantic import BaseModel

router = APIRouter()

class UserInput(BaseModel):
    message: str

@router.post("/chat/moderate")
async def chat_moderate(user_input: UserInput):
    is_toxic, toxicity_score = check_toxicity(user_input.message)
    if is_toxic:
        return {"response": f"Your message appears to be toxic (toxicity score: {toxicity_score}). Please rephrase your message politely."}

    llm_response = check_content_with_llm(user_input.message)

    if 'harmful' in llm_response or 'inappropriate' in llm_response:
        return {"response": "Your message seems inappropriate. Please rephrase your message in a more respectful way."}

    return {"response": "Your message is good to go!"}

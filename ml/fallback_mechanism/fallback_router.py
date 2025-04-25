from fastapi import APIRouter
from pydantic import BaseModel
from langdetect import detect
from .fallback_client import call_groq_model

router = APIRouter()

class UserInput(BaseModel):
    message: str

# Endpoint: Chat answer with alternatives and next step
@router.post("/chat/answer")
def chat_answer(user_input: UserInput):
    user_lang = detect(user_input.message)
    prompt = f"""User asked: "{user_input.message}"
        Please respond in a structured manner with the alternative steps clearly bifurcated:
        1. Two alternative suggestions
        2. A helpful next step

        Format the answer clearly using numbered points or bullet points.
        
        Always respond in the language of the user's message.
        """
    
    reply = call_groq_model(prompt, user_lang=user_lang)
    return {"response": reply}

# Endpoint: Not satisfied follow-up
@router.post("/chat/not_satisfied")
def chat_not_satisfied(user_input: UserInput):
    user_lang = detect(user_input.message)
    prompt = f"""The user was not satisfied with a previous answer to: "{user_input.message}" 
        Reply with:
        - A polite apology
        - Offer to connect with human support
        - (Optional) ask a clarifying question to try and help further'

        Always respond in the language of the user's message.
    """
    reply = call_groq_model(prompt, user_lang=user_lang)
    return {"response": reply} 

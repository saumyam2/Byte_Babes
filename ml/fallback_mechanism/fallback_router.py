from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load Gemini API key
load_dotenv()
genai_api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=genai_api_key)

# Initialize Gemini model
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

router = APIRouter()

class UserInput(BaseModel):
    message: str

# Endpoint: Chat answer with alternatives and next step
@router.post("/chat/answer")
def chat_answer(user_input: UserInput):
    prompt = f"""User asked: "{user_input.message}"

Please respond in a structured manner with the alternative steps clearly bifurcated:
1. Two alternative suggestions
2. A helpful next step

Format the answer clearly using numbered points or bullet points.

Always respond in the language of the user's message."""
    
    response = model.generate_content(prompt)
    return {"response": response.text}

# Endpoint: Not satisfied follow-up
@router.post("/chat/not_satisfied")
def chat_not_satisfied(user_input: UserInput):
    prompt = f"""The user was not satisfied with a previous answer to: "{user_input.message}" 

Reply with:
- A polite apology
- Offer to connect with human support
- (Optional) ask a clarifying question to try and help further

Always respond in the language of the user's message."""
    
    response = model.generate_content(prompt)
    return {"response": response.text}

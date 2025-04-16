from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

# Load env vars
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

# Init Groq client
groq_chat = ChatGroq(
    groq_api_key=groq_api_key,
    model_name="llama3-8b-8192",
)

# Init FastAPI
app = FastAPI(title="LinkedIn Message Generator API")

# Pydantic model for request body
class LinkedInRequest(BaseModel):
    name: str
    job_title: str
    purpose: str


def generate_linkedin_message_with_groq(name: str, job_title: str, purpose: str) -> str:
    prompt = (
        f"Write a short, friendly LinkedIn message to someone named {name} who works as a {job_title}. "
        f"The message should be for the purpose of {purpose.lower()}. "
        "Keep it professional but approachable. No more than 100 words. "
        "Use a tone that would work well in a connection request or a follow-up message."
    )
    try:
        response = groq_chat.predict(prompt)
        return response.strip()
    except Exception as e:
        return f"Error generating message: {e}"


@app.post("/generate-linkedin-message/")
async def generate_linkedin_message(data: LinkedInRequest):
    message = generate_linkedin_message_with_groq(data.name, data.job_title, data.purpose)
    return JSONResponse(content={"message": message})

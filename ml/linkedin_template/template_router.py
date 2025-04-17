from fastapi import APIRouter
from pydantic import BaseModel
from template_client import generate_linkedin_message_with_groq

router = APIRouter()

class LinkedInRequest(BaseModel):
    name: str
    job_title: str
    purpose: str

@router.post("/generate-linkedin-message/")
async def generate_linkedin_message(data: LinkedInRequest):
    message = generate_linkedin_message_with_groq(data.name, data.job_title, data.purpose)
    return {"message": message}

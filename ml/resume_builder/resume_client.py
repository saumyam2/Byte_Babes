import re
import os
from io import BytesIO
from typing import List
from PyPDF2 import PdfReader
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
model = "llama3-8b-8192"

groq_chat = ChatGroq(
    groq_api_key=groq_api_key,
    model_name=model,
)

def parse(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def clean_resume_text(resume_text: str) -> str:
    resume_text = re.sub(r'\s+', ' ', resume_text)
    return resume_text.strip()

def improve_resume_with_groq(resume_text: str, role_keywords: List[str]) -> str:
    cleaned_resume = clean_resume_text(resume_text)
    prompt = (
        f"Improve this resume for the job role, focusing on keywords: {', '.join(role_keywords)}.\n"
        "Just provide step-by-step improvements and explanations of why each improvement is necessary:\n\n"
        f"{cleaned_resume}. Don't generate a new resume."
    )
    try:
        response = groq_chat.predict(prompt)
        return response
    except Exception as e:
        return f"Error during Groq API call: {e}"

async def optimize_resume(file, keywords: str) -> str:
    file_bytes = await file.read()
    role_keywords = [kw.strip() for kw in keywords.split(",")]

    original_resume = parse(file_bytes)
    improvements = improve_resume_with_groq(original_resume, role_keywords)

    return improvements

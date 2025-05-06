import re
import os
from io import BytesIO
from typing import List
from PyPDF2 import PdfReader
from dotenv import load_dotenv
import google.generativeai as genai

# Load Gemini API key
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini model
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(model_name="gemini-2.0-flash")

def parse(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def clean_resume_text(resume_text: str) -> str:
    resume_text = re.sub(r'\s+', ' ', resume_text)
    return resume_text.strip()

def improve_resume(resume_text: str, role_keywords: List[str]) -> str:
    cleaned_resume = clean_resume_text(resume_text)
    prompt = (
        f"Improve this resume for the job role, focusing on keywords: {', '.join(role_keywords)}.\n"
        "Just provide step-by-step improvements and explanations of why each improvement is necessary:\n\n"
        f"{cleaned_resume}. Don't generate a new resume."
    )
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error during Gemini API call: {e}"

async def optimize_resume(file, keywords: str) -> str:
    file_bytes = await file.read()
    role_keywords = [kw.strip() for kw in keywords.split(",")]

    original_resume = parse(file_bytes)
    improvements = improve_resume(original_resume, role_keywords)

    return improvements

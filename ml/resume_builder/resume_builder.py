# import re
# import os
# from io import BytesIO
# from PyPDF2 import PdfReader
# from langchain_groq import ChatGroq
# from dotenv import load_dotenv

# # Load environment variables from .env file
# load_dotenv()

# # Get the API key from environment variables
# groq_api_key = os.getenv("GROQ_API_KEY")
# model = "llama3-8b-8192"  # Groq's LLaMA model

# # Initialize the Groq API connection using LangChain
# groq_chat = ChatGroq(
#     groq_api_key=groq_api_key,
#     model_name=model,
# )

# # Function to parse PDF bytes and extract text
# def parse(file_bytes: bytes) -> str:
#     """
#     Extracts text and skills from resume PDF content.
#     :param file_bytes: PDF file content as bytes
#     :return: Full text of the resume
#     """
#     reader = PdfReader(BytesIO(file_bytes))
#     text = ""
#     for page in reader.pages:
#         text += page.extract_text() or ""
#     return text

# # Function to clean and preprocess resume text
# def clean_resume_text(resume_text: str) -> str:
#     resume_text = re.sub(r'\s+', ' ', resume_text)  # Normalize spaces
#     resume_text = resume_text.strip()  # Remove leading/trailing spaces
#     return resume_text

# # Function to improve resume using Groq (LLaMA 3 model)
# def improve_resume_with_groq(resume_text: str, role_keywords: list) -> str:
#     cleaned_resume = clean_resume_text(resume_text)

#     # Construct a prompt to guide the improvement
#     prompt = f"Improve this resume for the job role, focusing on keywords: {', '.join(role_keywords)}.\n Just provide step-by-step improvements and explanations of why each improvement is necessary:\n\n{cleaned_resume}. Don't generate a new resume."

#     try:
#         # Use the 'predict()' method to send the prompt and get the response
#         response = groq_chat.predict(prompt)
#         return response  # Assuming the response contains the improvements directly
#     except Exception as e:
#         print(f"Error during Groq API call: {e}")
#         return "Error: Could not generate improvements."

# # Main function to run the resume builder
# def build_and_optimize_resume(file_bytes: bytes, role_keywords: list):
#     # Step 1: Parse the PDF bytes and extract text
#     original_resume = parse(file_bytes)
    
#     # Step 2: Improve the resume using Groq (LLaMA 3 model)
#     improved_steps = improve_resume_with_groq(original_resume, role_keywords)

#     # Step 3: Print the improvement steps with explanations
#     print(f"Suggested Improvements for Resume:\n{improved_steps}")

# # Example Usage:
# if __name__ == "__main__":
#     # Read the PDF file as bytes
#     with open("resume.pdf", "rb") as f:
#         file_bytes = f.read()

#     # Keywords for the specific role (e.g., software developer, project manager)
#     role_keywords = ["leadership", "software development", "Python", "team management", "problem solving", "agile", "project management"]
    
#     # Build and optimize the resume
#     build_and_optimize_resume(file_bytes, role_keywords)

import re
import os
from io import BytesIO
from typing import List
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from langchain_groq import ChatGroq
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
model = "llama3-8b-8192"

# Initialize Groq chat
groq_chat = ChatGroq(
    groq_api_key=groq_api_key,
    model_name=model,
)

app = FastAPI(title="Resume Optimizer API")


# === Utility Functions ===

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


# === FastAPI Endpoint ===

@app.post("/optimize-resume/")
async def optimize_resume(
    file: UploadFile = File(...),
    keywords: str = Form(..., description="Comma-separated keywords for the job role")
):
    """
    Upload a resume PDF and provide comma-separated job keywords.
    Returns improvement suggestions.
    """
    try:
        file_bytes = await file.read()
        role_keywords = [kw.strip() for kw in keywords.split(",")]

        original_resume = parse(file_bytes)
        improvements = improve_resume_with_groq(original_resume, role_keywords)

        return JSONResponse(content={"improvements": improvements})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

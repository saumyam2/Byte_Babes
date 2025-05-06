import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai_api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=genai_api_key)

model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def call_gemini_model(prompt: str, user_lang: str = "en") -> str:
    response = model.generate_content(prompt)
    return response.text

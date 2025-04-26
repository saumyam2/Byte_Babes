import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load API key from environment
load_dotenv()
genai_api_key = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=genai_api_key)

# Initialize Gemini model
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def call_gemini_model(prompt: str, user_lang: str = "en") -> str:
    # Gemini handles translation internally based on prompt context
    response = model.generate_content(prompt)
    return response.text

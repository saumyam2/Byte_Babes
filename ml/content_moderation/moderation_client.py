import os
import requests
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
PERSPECTIVE_API_KEY = os.getenv("PERSPECTIVE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(model_name="gemini-2.0-flash")

PERSPECTIVE_API_URL = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze"

def check_toxicity(message: str) -> dict:
    params = { "key": PERSPECTIVE_API_KEY }

    data = {
        "comment": {"text": message},
        "languages": ["en", "hi"],
        "requestedAttributes": {"TOXICITY": {}},
    }

    response = requests.post(PERSPECTIVE_API_URL, params=params, json=data)
    response.raise_for_status()
    result = response.json()

    toxicity_score = result["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
    is_toxic = toxicity_score > 0.7 
    return is_toxic, toxicity_score

def check_content_with_llm(message: str) -> str:
    prompt = f"""
    You are a smart assistant that understands Hinglish (Hindi written in English letters).
    You are a content moderator and assistant. Please review the following text:

    "{message}"

    Does this message contain harmful, disrespectful, or inappropriate content? 
    If yes, respond with 'Yes, harmful' or 'Yes, inappropriate'.
    If no, respond with 'No issue'.
    """
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip().lower()
    except Exception as e:
        return f"error: {e}"

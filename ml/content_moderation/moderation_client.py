import os
import requests
from dotenv import load_dotenv

load_dotenv()
PERSPECTIVE_API_KEY = os.getenv("PERSPECTIVE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

PERSPECTIVE_API_URL = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def check_toxicity(message: str) -> dict:
    params = {
        "key": PERSPECTIVE_API_KEY
    }

    data = {
        "comment": {"text": message},
        "languages": ["en"],
        "requestedAttributes": {"TOXICITY": {}},
    }

    response = requests.post(PERSPECTIVE_API_URL, params=params, json=data)
    response.raise_for_status()
    result = response.json()

    toxicity_score = result["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
    is_toxic = toxicity_score > 0.7 
    return is_toxic, toxicity_score

def check_content_with_llm(message: str) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
    You are a content moderator and assistant. Please review the following text:

    "{message}"

    Does this message contain harmful, disrespectful, or inappropriate content? 
    If yes, respond with 'Yes, harmful' or 'Yes, inappropriate'.
    If no, respond with 'No issue'.
    """

    payload = {
        "model": "llama3-8b-8192", 
        "messages": [
            {"role": "system", "content": "You are a content moderator and assistant."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    result = response.json()

    return result["choices"][0]["message"]["content"].strip().lower()

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel(model_name="gemini-2.0-flash")

def generate_linkedin_message_with_gemini(name: str, job_title: str, purpose: str) -> str:
    prompt = (
        f"Write a short, friendly LinkedIn message to someone named {name} who works as a {job_title}. "
        f"The message should be for the purpose of {purpose.lower()}. "
        "Keep it professional but approachable. No more than 100 words. "
        "Use a tone that would work well in a connection request or a follow-up message."
    )
    try:
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating message: {e}"

# print(generate_linkedin_message_with_gemini("Aditi", "Product Manager at Google", "networking and learning more about her work"))

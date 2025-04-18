from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
groq_chat = ChatGroq(
    groq_api_key=groq_api_key,
    model_name="llama3-8b-8192",
)

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

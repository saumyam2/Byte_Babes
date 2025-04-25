import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

groq_chat = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama3-8b-8192"
)

def classify_intent(user_message: str) -> str:
    prompt = f"""
    Classify the intent of the following user message into one of these categories:
    ["cold_email", "career_roadmap", "job_search", "mentor_match", "skill_gap_analysis", 
    "success_stories", "resume_feedback", "find_event", "general"]

    User message: "{user_message}"
    Only return the intent label.
    """

    return groq_chat.predict(prompt).strip().lower()

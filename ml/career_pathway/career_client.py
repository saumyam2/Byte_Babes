import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")

groq_chat = ChatGroq(
    groq_api_key=groq_api_key,
    model_name="llama3-8b-8192",
)

def generate_career_pathway(req) -> str:
    prompt = (
        f"Create a realistic, motivating career roadmap for someone currently working as a '{req.current_role}' "
        f"who wants to become a '{req.dream_role}' within {req.time_frame_years} years.\n"
    )
    if req.target_industry:
        prompt += f"Focus on the '{req.target_industry}' industry.\n"
    if req.target_companies:
        companies = ", ".join(req.target_companies)
        prompt += f"Consider aligning with career paths suitable for companies like: {companies}.\n"

    prompt += (
        "Break it down by year (e.g., Year 1, Year 2...), and include:\n"
        "- Skills to learn\n"
        "- Certifications to get\n"
        "- Experiences to pursue\n"
        "- Side projects to build\n"
        "- Networking strategies\n\n"
        "Make it practical and inspiring."
    )

    try:
        response = groq_chat.predict(prompt)
        return response.strip()
    except Exception as e:
        return f"Error: {e}"

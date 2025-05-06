import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
google_api_key = os.getenv("GEMINI_API_KEY")  

genai.configure(api_key=google_api_key)

model = genai.GenerativeModel(model_name="gemini-2.0-flash")

def generate_career_pathway(req) -> str:
    prompt = (
        f"Create a realistic, motivating career roadmap for someone currently working as a '{req.current_role}' "
        f"who wants to become a '{req.dream_role}' within {req.time_frame_years} years.\n"
    )

    if req.user_stage.lower() == "starter":
        prompt += "Assume the person is just starting their career (a student or recent graduate).\n"
    elif req.user_stage.lower() == "restarter":
        prompt += "Assume the person is restarting their career after a gap or switch.\n"
    elif req.user_stage.lower() == "riser":
        prompt += "Assume the person is already experienced and looking to rise into leadership or senior roles.\n"

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
        "The output should always be in the same language as the input."
    )

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error: {e}"

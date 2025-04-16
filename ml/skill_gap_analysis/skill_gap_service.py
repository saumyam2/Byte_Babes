import os
import json

from typing import List
import google.generativeai as genai
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("GEMINI_API_KEY")

class CourseRecommendation(BaseModel):
    url: str
    certification_available: bool

class Step(BaseModel):
    step_title: str
    recommended_courses: List[CourseRecommendation]

class LearningRoadmap(BaseModel):
    steps: List[Step]


def get_skill_learning_roadmap(skill: str) -> str:
    return f"""
You are an expert learning path designer and career mentor.

Please provide a 5-step learning roadmap for mastering the skill: **{skill}**

At each step, include:
1. A step title (like “Redux”)
2. A list of **3 recommended courses** for each step, each containing:
    - Course URL
    - Whether a certificate is available (True/False)
"""


def get_skill_roadmap(skill: str) -> dict:
    prompt = get_skill_learning_roadmap(skill)

    genai.configure(api_key=API_KEY)
    client = genai.GenerativeModel(model_name="gemini-2.0-flash")

    try:
        response = client.generate_content(
            contents=prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
            ),
        )

        if not response.text:
            raise ValueError("API response text is empty.")

        return json.loads(response.text)

    except Exception as e:
        print(f"Error generating roadmap: {e}")
        raise


if __name__ == "__main__":
    skill = "React"
    roadmap = get_skill_roadmap(skill)
    print(json.dumps(roadmap, indent=2))

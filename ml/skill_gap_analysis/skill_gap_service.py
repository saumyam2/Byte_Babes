import os
from textwrap import dedent
from typing import List

from agno.agent import Agent, RunResponse
from agno.tools.googlesearch import GoogleSearchTools
from agno.models.google import Gemini
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


class CourseRecommendation(BaseModel):
    url: str = Field(
        ...,
        description="Direct URL to the course. If not available, use 'N/A'."
    )
    certification: bool = Field(
        ...,
        description="Whether the course provides a certificate of completion (true or false)."
    )


class Step(BaseModel):
    title: str = Field(
        ...,
        description="The title for this learning step (e.g., 'Master React Hooks'). Should clearly summarize the learning goal."
    )
    recommended_courses: List[CourseRecommendation] = Field(
        ...,
        description="A list of 2-3 curated courses that help achieve this step's goal."
    )


class LearningRoadmap(BaseModel):
    steps: List[Step] = Field(
        ...,
        description="A 3 to 5-step learning progression, each building on the previous, leading to mastery of the skill."
    )


def generate_learning_roadmap(prompt: str) -> dict:
    agent = Agent(
        model=Gemini(id="gemini-2.0-flash"),
        description=dedent("""\
            You are a world-class skill mentor and learning architect trusted by millions of learners! 📚
            With the clarity of Sal Khan, the depth of Andrew Ng, and the structure of MIT OCW,
            you design powerful, step-by-step learning journeys that make complex topics accessible and actionable.

            Your specialty is breaking down high-level skills into 3–5 progressive steps, each with curated, high-quality course recommendations. 
            You DON'T HALLUCINATE while searching for links on Google for URLS\
        """),
        instructions=dedent("""\
            When crafting learning roadmaps, follow these principles:

            1. Define a clear progression:
               - Break the target skill into logical stages of learning (max 5)
               - Ensure each step builds on the previous one
               - Start from beginner-friendly foundations and move to advanced mastery

            2. Add value to each step:
               - Use simple, actionable step titles (e.g., “Master React State Management”)
               - Give a short but informative description of what the learner will gain
               - Avoid jargon unless explained clearly

            3. Curate recommended courses:
               - Provide 2–3 highly relevant online courses per step. Use GOOGLE to search for URLS and give correct URLS.
               - Include URL and whether certification is available
               - Prefer free or affordable options when possible
        """),
        response_model=LearningRoadmap,
        use_json_mode=True,
        tools=[GoogleSearchTools()],
    )

    response: RunResponse = agent.run(prompt)
    return response.content

if __name__ == "__main__":
    roadmap = generate_learning_roadmap("Learn Web Development")
    print(roadmap)

# resume_parser_text.py
import re

SKILL_KEYWORDS = [
    "artificial intelligence",
    "machine learning",
    "data science",
    "deep learning",
    "NLP",
    "CV",
    "blockchain",
    "python",
    "java",
    "c++",
    "c",
    "node.js",
    "react",
    "angular",
    "sql",
    "mysql",
    "mongodb",
    "snowflake",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "tensorflow",
    "pytorch",
    "html",
    "css",
    "javascript",
    "tailwind css",
    "git",
    "github",
    "linux",
    "rest",
    "graphql",
    "flask",
    "django",
    "spark",
    "hadoop",
    "tableau",
    "powerbi",
    "langchain",
    "autogen",
    "crewai",
    "next.js",
    "express.js",
]


def parse_text_resume(text: str) -> list:
    """
    Extracts skills from resume plain text content.
    :param text: Resume content as a plain text string
    :return: Sorted list of extracted skills
    """
    clean_text = text.lower()
    found_skills = set()

    for skill in SKILL_KEYWORDS:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, clean_text):
            found_skills.add(skill)

    return sorted(list(found_skills))

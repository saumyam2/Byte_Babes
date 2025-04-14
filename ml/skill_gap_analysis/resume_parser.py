# resume_parser.py
from io import BytesIO
from PyPDF2 import PdfReader
import re

SKILL_KEYWORDS = [
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


def parse_resume(file_bytes: bytes) -> str:
    """
    Extracts text and skills from resume PDF content.
    :param file_bytes: PDF file content as bytes
    :return: Dict with full text and extracted skills
    """
    reader = PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""

    clean_text = text.lower()
    found_skills = set()

    for skill in SKILL_KEYWORDS:
        pattern = r"\b" + re.escape(skill.lower()) + r"\b"
        if re.search(pattern, clean_text):
            found_skills.add(skill)

    return sorted(list(found_skills))

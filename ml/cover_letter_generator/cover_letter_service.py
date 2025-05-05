import os
import datetime
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.environ.get("GEMINI_API_KEY")


def create_cover_letter(resume: str, company: str, job_desc: str) -> str:
    """
    Uses Gemini to generate a well-formatted Markdown cover letter with the current date
    aligned to the top right, based on the candidate's resume, the company, and job description.
    """

    today_date = datetime.datetime.now().strftime("%B %d, %Y")

    prompt = f"""
You are a professional resume and cover letter writer.

Generate a **Markdown-formatted cover letter** for the following scenario. The format must:

- Have the current date ("{today_date}") **right-aligned at the top**, Eg: Date: ("{today_date}").
- Maintain clear formatting with bold text, paragraphs, line breaks, and proper salutations.
- Sound formal, confident, and personalized to the company and role.
- Use the resume to match qualifications with the job description and company.
- Highlight why the candidate is a great fit for this specific job at this company.
- Assume data which is missing, DON'T leave comments for the user to enter it.
- **Bold only key skills, technologies, company names, degrees, job titles, and other important achievements from the resume**. Do NOT randomly bold full sentences or generic text.

**Resume:**
---
{resume}
---

**Company:**
{company}

**Job Description:**
---
{job_desc}
---

Generate only the markdown content. Do not add explanation or metadata. The output must be ready to render as a PDF with bold formatting.
"""

    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")

    try:
        response = model.generate_content(prompt)

        if not response.text:
            raise ValueError("API response is empty.")

        cleaned_text = response.text

        # Remove Markdown code block wrappers if present
        if cleaned_text.startswith("```markdown\n"):
            cleaned_text = cleaned_text[len("```markdown\n") :]

        if cleaned_text.endswith("\n```"):
            cleaned_text = cleaned_text[: -len("\n```")]

        # Convert any HTML-like <br> to proper Markdown spacing
        cleaned_text = (
            cleaned_text.replace("<br>", "\n\n")
            .replace("<br/>", "\n\n")
            .replace("<br />", "\n\n")
        )

        # Normalize spacing (optional but improves formatting)
        cleaned_text = "\n\n".join(
            [line.strip() for line in cleaned_text.splitlines() if line.strip()]
        )

        print(cleaned_text)
        return cleaned_text

    except Exception as e:
        print(f"Error generating cover letter: {e}")
        raise


# # Uncomment and test with sample data if needed
# if __name__ == "__main__":
#     resume = """
# John Doe is a software engineer with 5 years of experience in backend development,
# primarily using Python and Node.js. He has worked at Google and a mid-stage startup
# where he led a team and scaled systems to handle millions of users.
# He has a strong academic background with a B.Tech from IIT Bombay.
#     """

#     company = "Stripe"
#     job_desc = """
# Stripe is looking for a Backend Engineer to help build the future of global payments.
# The ideal candidate will have experience with distributed systems, payment processing,
# and building scalable infrastructure.
#     """

#     try:
#         markdown_cover_letter = create_cover_letter(resume, company, job_desc)
#         print("--- Markdown Cover Letter ---")
#         print(markdown_cover_letter)
#     except Exception as e:
#         print(f"Failed to generate cover letter: {e}")

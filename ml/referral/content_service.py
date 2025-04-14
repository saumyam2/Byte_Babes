# import os
# import json
# import re

# import google.generativeai as genai
# from pydantic import BaseModel
# from dotenv import load_dotenv

# load_dotenv()

# API_KEY = os.environ.get("GEMINI_API_KEY")


# class Mail(BaseModel):
#     subject: str
#     body: str


# def clean_and_parse_response(raw_text):
#     # Remove triple backticks or markdown
#     cleaned = re.sub(r"```(?:json)?", "", raw_text).strip()
#     return json.loads(cleaned)


# def get_content(resume, company, job_id, job_role):

#     prompt = f"""
#     You are an expert HR professional writing referral emails.

#     Based on the following details:
#     - Resume of the candidate (below)
#     - Company: {company}
#     - Job Role: {job_role}
#     - Job ID: {job_id}

#     Write a professional referral email that includes:
#     1. A concise and compelling subject line.
#     2. A short email body suitable for sending to a referral contact, including the candidate's strengths, experience, and enthusiasm for the role.

#     **Resume:**
#     ---
#     {resume}
#     ---
#     """

#     genai.configure(api_key=API_KEY)
#     client = genai.GenerativeModel(model_name="gemini-2.0-flash")

#     response = client.generate_content(
#         contents=prompt,
#         generation_config=genai.types.GenerationConfig(
#             response_mime_type="application/json",
#             response_schema=Mail,
#         ),
#     )

#     response = clean_and_parse_response(response.text)
#     return response["subject"], response["body"]


# if __name__ == "__main__":
#     resume = "John Doe is a software engineer with 5 years of experience in backend development,\nprimarily using Python and Node.js. He has worked at Google and a mid-stage startup\nwhere he led a team and scaled systems to handle millions of users.\nHe has a strong academic background with a B.Tech from IIT Bombay."
#     company = "Stripe"
#     job_id = "2024-ENG-245"
#     job_role = "Backend Engineer"

#     result = get_content(resume, company, job_id, job_role)
#     # print("Subject:", result["subject"])
#     # print("Body:", result["body"])
#     print(result)


# (Imports and setup remain the same)


import os
import json
import re

import google.generativeai as genai
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("GEMINI_API_KEY")


class Mail(BaseModel):
    subject: str
    body: str


def clean_and_parse_response(raw_text: str) -> dict:
    """
    Removes markdown formatting (like ```json ... ```) and parses the string as JSON.
    Handles potential JSON decoding errors.
    """
    # Remove triple backticks and optional 'json' language identifier
    cleaned = re.sub(r"```(?:json)?", "", raw_text).strip()

    try:
        # Attempt to parse the cleaned string as JSON
        parsed_json = json.loads(cleaned)
        # Optional: Validate if it matches the Mail structure conceptually
        # (Pydantic validation already happened implicitly on the API side if schema was used)
        if (
            isinstance(parsed_json, dict)
            and "subject" in parsed_json
            and "body" in parsed_json
        ):
            return parsed_json
        else:
            # Handle cases where JSON is valid but doesn't match expected structure
            print(
                f"Warning: Parsed JSON does not match expected Mail structure: {parsed_json}"
            )
            # Decide how to handle this: return None, raise error, return partial?
            # For now, let's return it as is, but the caller should be aware.
            return (
                parsed_json  # Or raise ValueError("Parsed JSON missing required keys")
            )

    except json.JSONDecodeError as e:
        print(f"Error: Failed to decode JSON.")
        print(f"Original text: {raw_text}")
        print(f"Cleaned text: {cleaned}")
        print(f"Error details: {e}")
        # Decide how to handle this: raise the error, return None, return default?
        raise ValueError(f"Failed to parse API response as JSON: {e}") from e
    except Exception as e:  # Catch other potential errors
        print(f"An unexpected error occurred during parsing: {e}")
        raise


def get_content(resume: str, company: str, job_id: str, job_role: str) -> dict:
    """
    Generates referral email content (subject and body) using Gemini API
    and returns it as a dictionary.
    """
    prompt = f"""
        Hello [Referral Contact's Name],

        You are an expert HR professional writing referral emails. Please write from a first-person perspective, as if you are the candidate. Give the entire body of the email yourself.

        Based on the following details:
        - Resume of the candidate (below)
        - Company: {company}
        - Job Role: {job_role}
        - Job ID: {job_id}

        Kindly draft a professional referral email that includes:
        1. A concise and compelling subject line.
        2. A short and impactful email body suitable for sending to a referral contact. The email should highlight the candidate's strengths, relevant experience, and enthusiasm for the role.

        **Resume:**
        ---
        {resume}
        ---

        Best regards,  
        [Your Name]
        """

    genai.configure(api_key=API_KEY)
    # Consider making the client creation more efficient if called multiple times
    # e.g., create it once outside the function or use a global/class variable.
    client = genai.GenerativeModel(
        model_name="gemini-1.5-flash"
    )  # Using 1.5 flash as it's generally recommended now

    try:
        response = client.generate_content(
            contents=prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                # The schema definition is helpful for the API but doesn't
                # automatically parse into a Pydantic object on the client side
                # without extra steps. The mime_type handles the JSON format.
                # response_schema=Mail, # Keep or remove? Keeping it helps guide the model.
            ),
        )

        # Access the raw text content from the response
        # Ensure response.text exists and is not empty
        if not response.text:
            raise ValueError("API response text is empty.")

        # Clean and parse the text response
        parsed_data = clean_and_parse_response(response.text)
        return parsed_data  # Return the dictionary

    except Exception as e:
        # Catch potential errors during API call or processing
        print(f"An error occurred in get_content: {e}")
        # Re-raise the exception or return an error indicator
        # For simplicity here, re-raising. Consider more specific handling.
        raise


if __name__ == "__main__":
    resume = "John Doe is a software engineer with 5 years of experience in backend development,\nprimarily using Python and Node.js. He has worked at Google and a mid-stage startup\nwhere he led a team and scaled systems to handle millions of users.\nHe has a strong academic background with a B.Tech from IIT Bombay."
    company = "Stripe"
    job_id = "2024-ENG-245"
    job_role = "Backend Engineer"

    try:
        result = get_content(resume, company, job_id, job_role)
        print("--- Generated Content ---")
        print(f"Subject: {result.get('subject', 'N/A')}")  # Use .get for safer access
        print(f"Body:\n{result.get('body', 'N/A')}")
        print("\n--- Raw Dictionary ---")
        print(result)
    except Exception as e:
        print(f"\nFailed to get content: {e}")

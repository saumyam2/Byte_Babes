import os
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from cover_letter_generator.text_parse import extract_text
from cover_letter_generator.cover_letter_builder import create_pdf_from_markdown
from cover_letter_generator.cover_letter_service import create_cover_letter
import tempfile

router = APIRouter(tags=["cover-letter"])


@router.post("/cover-letter")
async def generate_cover_letter(
    resume: UploadFile = File(...),
    job_description_file: UploadFile = File(None),
    job_description_text: str = Form(None),
    company: str = Form(...),
):
    try:
        # Extract text from the resume
        resume_text = extract_text(resume.file)
        if not resume_text.strip():
            raise ValueError("The uploaded resume appears to be empty or unreadable.")
        print("Resume Text:", resume_text)

        # Extract job description
        if job_description_file:
            job_description_text = extract_text(job_description_file.file)
            if not job_description_text.strip():
                raise ValueError(
                    "The uploaded job description file appears to be empty."
                )
            print("Job Description Text:", job_description_text)
        elif job_description_text:
            job_description_text = job_description_text.strip()
            if not job_description_text:
                raise ValueError("Job description text is empty.")
            print("Job Description Text:", job_description_text)
        else:
            raise HTTPException(
                status_code=400,
                detail="Either job_description_file or job_description_text is required.",
            )

        # Generate cover letter markdown
        try:
            cover_letter_content = create_cover_letter(
                resume=resume_text,
                company=company,
                job_desc=job_description_text,
            )
            print("Cover Letter Content:", cover_letter_content)
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=f"Failed to generate cover letter: {str(e)}"
            )

        # Create temporary directory for saving the PDF
        temp_dir = tempfile.gettempdir()
        pdf_file_path = os.path.join(temp_dir, "cover_letter.pdf")

        # Convert to PDF and save to the file path
        try:
            # Make sure the PDF is generated and saved to the path
            create_pdf_from_markdown(cover_letter_content, pdf_file_path)
            if not os.path.exists(pdf_file_path):
                raise Exception("Failed to generate PDF file.")
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to convert cover letter to PDF: {str(e)}",
            )

        # Return the PDF file as a downloadable response
        return FileResponse(
            pdf_file_path, media_type="application/pdf", filename="cover_letter.pdf"
        )

    except HTTPException as http_ex:
        raise http_ex

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Unexpected error occurred: {str(e)}"
        )

from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from ml.skill_gap_analysis.parser import parse

router = APIRouter(tags=["skill-gap-analysis"])


@router.post("/skill-gap-analysis")
async def analyze(
    resume: UploadFile = File(...), job_description: UploadFile = File(...)
):
    resume = await resume.read()
    job_description = await job_description.read()

    resume_skills = parse(resume)
    jd_skills = parse(job_description)

    print("Resume Skills:", resume_skills)
    print("Job Description Skills:", jd_skills)

    missing_skills = set(jd_skills) - set(resume_skills)

    return JSONResponse(
        content={
            "missing_skills": list(missing_skills),
        }
    )

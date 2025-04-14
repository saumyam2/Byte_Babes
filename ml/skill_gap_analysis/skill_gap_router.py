from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from skill_gap_analysis.resume_parser import parse_resume

router = APIRouter(tags=["skill-gap-analysis"])


@router.post("/skill-gap-analysis")
async def analyze(
    resume: UploadFile = File(...),
    job_description: str = Form(...)):
    contents = await resume.read()
    
    skills = parse_resume(contents)
    
    return JSONResponse(content={
        "skills": skills
    })
from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from fastapi.responses import JSONResponse
from skill_gap_analysis.parser import parse
from skill_gap_analysis.skill_gap_service import generate_learning_roadmap
from skill_gap_analysis.text_parse import parse_text_resume

router = APIRouter(tags=["skill-gap-analysis"])


@router.post("/skill-gap-analysis")
async def analyze(
    resume: UploadFile = File(...),
    job_description_file: UploadFile = File(None),
    job_description_text: str = Form(None),
):
    resume_content = await resume.read()
    if job_description_file:
        jd_content = await job_description_file.read()
        jd_skills = parse(jd_content)
    else:
        jd_skills = parse_text_resume(job_description_text)

    resume_skills = parse(resume_content)
    missing_skills = set(jd_skills) - set(resume_skills)

    roadmaps = {}

    for skill in missing_skills:
        try:
            roadmap = generate_learning_roadmap(skill)
            roadmaps[skill] = roadmap.dict()
        except Exception as e:
            roadmaps[skill] = {"error": str(e)}

    if roadmaps:
        return JSONResponse(content=roadmaps)
    else:
        return JSONResponse(content={"message": "No missing skills found."})

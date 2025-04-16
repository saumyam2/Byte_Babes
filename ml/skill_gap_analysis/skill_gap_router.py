from fastapi import APIRouter, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from skill_gap_analysis.parser import parse
from skill_gap_analysis.skill_gap_service import get_skill_roadmap

router = APIRouter(tags=["skill-gap-analysis"])


@router.post("/skill-gap-analysis")
async def analyze(
    resume: UploadFile = File(...), job_description: UploadFile = File(...)
):
    resume_content = await resume.read()
    jd_content = await job_description.read()

    resume_skills = parse(resume_content)
    jd_skills = parse(jd_content)

    missing_skills = set(jd_skills) - set(resume_skills)

    roadmaps = {}

    for skill in missing_skills:
        try:
            roadmap = get_skill_roadmap(skill)
            roadmaps[skill] = roadmap
        except Exception as e:
            roadmaps[skill] = {"error": str(e)}

    if roadmaps:
        return JSONResponse(content=roadmaps)
    else:
        return JSONResponse(
            content={"message": "No missing skills found."}
        )

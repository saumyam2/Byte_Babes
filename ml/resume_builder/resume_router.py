from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import JSONResponse
from resume_client import optimize_resume

router = APIRouter()

@router.post("/optimize-resume/")
async def optimize_resume_route(
    file: UploadFile = File(...),
    keywords: str = Form(..., description="Comma-separated keywords for the job role")
):
    try:
        improvements = await optimize_resume(file, keywords)
        return JSONResponse(content={"improvements": improvements})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

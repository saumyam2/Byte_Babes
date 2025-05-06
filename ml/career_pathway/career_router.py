from fastapi import APIRouter
from pydantic import BaseModel
from career_client import generate_career_pathway

router = APIRouter()

class CareerRequest(BaseModel):
    current_role: str
    dream_role: str
    time_frame_years: int
    target_industry: str = ""
    target_companies: list[str] = []
    user_stage: str  

@router.post("/generate-career-pathway/")
async def get_career_pathway(request: CareerRequest):
    result = generate_career_pathway(request)
    return {"career_pathway": result}

from fastapi import APIRouter
from pydantic import BaseModel
from gender_bias.gender_bias_service import get_bias

router = APIRouter(tags=["gender-bias"])


class GenderBiasRequest(BaseModel):
    text: str


@router.post("/gender-bias")
async def analyze_gender_bias(request: GenderBiasRequest):
    result = get_bias(request.text)
    return result[0], result[1]  # Return is_toxic and scaled_score as a tuple

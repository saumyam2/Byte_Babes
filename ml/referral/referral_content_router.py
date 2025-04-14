from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from referral.referral_email_service import send_email
from referral.content_service import get_content


class MailRequest(BaseModel):
    to: EmailStr
    resume: str
    company: str
    job_id: str
    job_role: str


router = APIRouter(tags=["referal-template"])


@router.post("/referral-template")
async def send_mail(request: MailRequest):
    try:
        data = get_content(
            request.resume, request.company, request.job_id, request.job_role
        )
        # subject = data["subject"]
        # body = data["body"]
        # send_email(to_email=request.to, subject=subject, body=body)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter
from app.schemas.interview import InterviewRequest
from app.services.ai_service import generate_questions

router = APIRouter()


@router.post("/generate")
async def generate(request: InterviewRequest):

    questions = generate_questions(request.cv_text)

    return {
        "status": "success",
        "questions": questions,
    }
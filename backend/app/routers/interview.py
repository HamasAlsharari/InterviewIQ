from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.interview import InterviewRequest
from app.services.ai_service import generate_questions
from app.crud.interview import save_interview
from fastapi import HTTPException
from app.models.interview import Interview
import re

router = APIRouter()


@router.post("/generate")
async def generate(
    request: InterviewRequest,
    db: Session = Depends(get_db),
):

    questions = generate_questions(request.cv_text)
    print("USER ID =", request.user_id)

    interview = save_interview(
        db=db,
        questions=questions,
        user_id=request.user_id,
    )

    return {
        "status": "success",
        "interview_id": interview["interview_id"],
        "questions": interview["questions"],
    }

@router.get("/result/{interview_id}")
def get_interview_result(
    interview_id: int,
    db: Session = Depends(get_db),
):
    interview = (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    questions = []

    scores = []

    for q in interview.questions:

        match = re.search(
            r"Score:\s*(\d+(?:\.\d+)?)/10",
            q.feedback or "",
        )

        if match:
            question_score = float(match.group(1))
            scores.append(question_score)
        else:
            question_score = float(q.score or 0)
            scores.append(question_score)

        questions.append(
            {
                "id": q.id,
                "question": q.question,
                "answer": q.answer,
                "feedback": q.feedback,
                "score": question_score,
            }
        )

    
    average_score = (
        round(sum(scores) / len(scores), 1)
        if scores
        else 0
    )

    return {
        "interview_id": interview.id,
        "average_score": average_score,
        "questions": questions,
    }
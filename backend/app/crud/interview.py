from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.interview_question import InterviewQuestion


def save_interview(
    db: Session,
    questions: list[str],
    user_id: int,
):
    interview = Interview(
        title="AI Interview",
        average_score=0,
        user_id=user_id,
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    saved_questions = []

    for question in questions:

        interview_question = InterviewQuestion(
            interview_id=interview.id,
            question=question,
            answer="",
            feedback="",
            score=0,
        )

        db.add(interview_question)
        db.commit()
        db.refresh(interview_question)

        saved_questions.append(
            {
                "id": interview_question.id,
                "question": interview_question.question,
            }
        )

    return {
        "interview_id": interview.id,
        "questions": saved_questions,
    }
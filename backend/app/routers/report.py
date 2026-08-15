from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

from app.database.database import get_db
from app.models.user import User
from app.models.interview import Interview
from app.core.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


@router.get("/{interview_id}")
def generate_report(
    interview_id: int,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email = payload.get("sub")

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    interview = (
        db.query(Interview)
        .filter(
            Interview.id == interview_id,
            Interview.user_id == user.id,
        )
        .first()
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    filename = f"Interview_Report_{interview.id}.pdf"

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "<b>InterviewIQ</b>",
            styles["Title"],
        )
    )

    elements.append(
        Paragraph(
            "AI Interview Assessment Report",
            styles["Heading2"],
        )
    )

    elements.append(
        Paragraph("<br/>", styles["Normal"])
    )

    elements.append(
        Paragraph(
            f"<b>Title:</b> {interview.title}",
            styles["Normal"],
        )
    )

    elements.append(
        Paragraph(
            f"<b>Average Score:</b> {interview.average_score}/10",
            styles["Normal"],
        )
    )

    elements.append(
        Paragraph("<br/><br/>", styles["Normal"])
    )

    for index, question in enumerate(interview.questions):

        elements.append(
            Paragraph(
                f"<b>Question {index + 1}</b>",
                styles["Heading2"],
            )
        )

        elements.append(
            Paragraph(
                question.question,
                styles["Normal"],
            )
        )

        elements.append(
            Paragraph(
                f"<b>Your Answer:</b><br/>{question.answer if question.answer else 'No answer provided.'}",
                styles["Normal"],
            )
        )

        if question.answer:
            score_text = f"{question.score}/10"
        else:
            score_text = "Not evaluated."

        elements.append(
            Paragraph(
                f"<b>Score:</b> {score_text}",
                styles["Normal"],
            )
        )

        feedback_text = (
            question.feedback
            if question.feedback
            else "No feedback available."
        )

        elements.append(
            Paragraph(
                f"<b>Feedback:</b><br/>{feedback_text}",
                styles["Normal"],
            )
        )

        elements.append(
            Paragraph("<br/><br/>", styles["Normal"])
        )

    doc.build(elements)

    return FileResponse(
        filename,
        media_type="application/pdf",
        filename=filename,
    )
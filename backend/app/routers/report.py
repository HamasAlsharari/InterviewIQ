import os
import tempfile
from xml.sax.saxutils import escape

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
)

from app.database.database import get_db
from app.models.user import User
from app.models.interview import Interview
from app.core.jwt_handler import SECRET_KEY, ALGORITHM


router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


def clean_text(text):
    if not text:
        return ""

    text = str(text)
    text = escape(text)
    text = text.replace("\n", "<br/>")

    return text


def add_page_number(canvas, doc):
    canvas.saveState()

    width, height = A4

    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(
        20 * mm,
        height - 15 * mm,
        "InterviewIQ"
    )

    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(
        width - 20 * mm,
        height - 15 * mm,
        "AI Interview Assessment"
    )

    canvas.setStrokeColor(colors.lightgrey)
    canvas.line(
        20 * mm,
        12 * mm,
        width - 20 * mm,
        12 * mm
    )

    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(
        width / 2,
        7 * mm,
        f"Page {doc.page}"
    )

    canvas.restoreState()


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
        .filter(Interview.id == interview_id)
        .first()
    )

    print("REPORT USER ID =", user.id)
    print("INTERVIEW ID =", interview_id)
    print(
        "INTERVIEW USER ID =",
        interview.user_id if interview else None
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found",
        )

    if interview.user_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this interview",
        )

    temp_file = tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".pdf"
    )

    filename = temp_file.name
    temp_file.close()

    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=25 * mm,
        bottomMargin=20 * mm,
        title="InterviewIQ Assessment Report",
        author="InterviewIQ",
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=30,
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=12,
        leading=18,
        alignment=TA_CENTER,
        textColor=colors.grey,
        spaceAfter=20,
    )

    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=17,
        spaceAfter=8,
    )

    question_style = ParagraphStyle(
        "Question",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=16,
        spaceAfter=8,
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=15,
        spaceAfter=6,
    )

    label_style = ParagraphStyle(
        "Label",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=14,
        spaceAfter=3,
    )

    score_style = ParagraphStyle(
        "Score",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        alignment=TA_LEFT,
    )

    small_style = ParagraphStyle(
        "Small",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=13,
        textColor=colors.grey,
    )

    elements = []

    elements.append(
        Spacer(1, 8 * mm)
    )

    elements.append(
        Paragraph(
            "InterviewIQ",
            title_style
        )
    )

    elements.append(
        Paragraph(
            "AI Interview Assessment Report",
            subtitle_style
        )
    )

    title_text = clean_text(
        interview.title or "AI Interview"
    )

    average_score = (
        interview.average_score
        if interview.average_score is not None
        else 0
    )

    info_data = [
        [
            Paragraph(
                "<b>Interview</b>",
                body_style
            ),
            Paragraph(
                title_text,
                body_style
            ),
        ],
        [
            Paragraph(
                "<b>Overall Score</b>",
                body_style
            ),
            Paragraph(
                f"<b>{average_score}/10</b>",
                score_style
            ),
        ],
        [
            Paragraph(
                "<b>Total Questions</b>",
                body_style
            ),
            Paragraph(
                str(len(interview.questions)),
                body_style
            ),
        ],
    ]

    info_table = Table(
        info_data,
        colWidths=[45 * mm, 120 * mm],
        hAlign="CENTER",
    )

    info_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    colors.whitesmoke,
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.7,
                    colors.lightgrey,
                ),
                (
                    "INNERGRID",
                    (0, 0),
                    (-1, -1),
                    0.4,
                    colors.lightgrey,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    elements.append(info_table)

    elements.append(
        Spacer(1, 12 * mm)
    )

    elements.append(
        HRFlowable(
            width="100%",
            thickness=0.8,
            color=colors.lightgrey,
            spaceBefore=4,
            spaceAfter=12,
        )
    )

    for index, question in enumerate(interview.questions):

        question_number = index + 1

        question_text = clean_text(
            question.question
        )

        answer_text = clean_text(
            question.answer
            if question.answer
            else "No answer provided."
        )

        feedback_text = clean_text(
            question.feedback
            if question.feedback
            else "No feedback available."
        )

        if question.answer:
            score_text = (
                f"{question.score}/10"
                if question.score is not None
                else "Not evaluated"
            )
        else:
            score_text = "Not evaluated"

        question_header = Paragraph(
            f"Question {question_number}",
            section_style
        )

        question_content = Paragraph(
            question_text,
            question_style
        )

        answer_label = Paragraph(
            "<b>Your Answer</b>",
            label_style
        )

        answer_content = Paragraph(
            answer_text,
            body_style
        )

        score_label = Paragraph(
            f"<b>Score:</b> {score_text}",
            score_style
        )

        feedback_label = Paragraph(
            "<b>AI Feedback</b>",
            label_style
        )

        feedback_content = Paragraph(
            feedback_text,
            body_style
        )

        question_data = [
            [question_header],
            [question_content],
            [answer_label],
            [answer_content],
            [score_label],
            [feedback_label],
            [feedback_content],
        ]

        question_table = Table(
            question_data,
            colWidths=[165 * mm],
            hAlign="CENTER",
        )

        question_table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, 0),
                        colors.whitesmoke,
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.7,
                        colors.lightgrey,
                    ),
                    (
                        "INNERGRID",
                        (0, 0),
                        (-1, -1),
                        0.25,
                        colors.lightgrey,
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        12,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        12,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "TOP",
                    ),
                ]
            )
        )

        elements.append(
            KeepTogether(
                [
                    question_table,
                    Spacer(1, 8 * mm),
                ]
            )
        )

    elements.append(
        Spacer(1, 5 * mm)
    )

    elements.append(
        Paragraph(
            "This report was generated automatically by InterviewIQ "
            "using AI-powered interview evaluation.",
            small_style,
        )
    )

    doc.build(
        elements,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number,
    )

    return FileResponse(
        filename,
        media_type="application/pdf",
        filename=f"Interview_Report_{interview.id}.pdf",
    )
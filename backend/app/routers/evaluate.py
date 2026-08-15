from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from openai import OpenAI
from dotenv import load_dotenv
import os
import re

from app.database.database import get_db
from app.schemas.evaluate import EvaluationRequest
from app.models.interview_question import InterviewQuestion

load_dotenv()

router = APIRouter()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)


@router.post("/evaluate")
async def evaluate(
    request: EvaluationRequest,
    db: Session = Depends(get_db),
):

    prompt = f"""
You are an expert Software Engineering interviewer.

Evaluate the following interview answer.

Question:
{request.question}

Candidate Answer:
{request.answer}

Return your response exactly in this format:

Score: X/10

Strengths:
- ...

Weaknesses:
- ...

Suggested Answer:
...
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.3,
    )

    feedback = response.choices[0].message.content

    match = re.search(r"Score:\s*(\d+(?:\.\d+)?)/10", feedback)

    score = float(match.group(1)) if match else 0

    interview_question = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.id == request.question_id
        )
        .first()
    )

    if interview_question:

        interview_question.answer = request.answer
        interview_question.feedback = feedback
        interview_question.score = int(score)

        db.commit()

        questions = interview_question.interview.questions

        total = sum(q.score for q in questions)

        average = round(total / len(questions), 1)

        interview_question.interview.average_score = average

        db.commit()

    return {
        "feedback": feedback,
        "score": score,
        "interview_id": (
            interview_question.interview.id
            if interview_question
            else None

        ),
    }
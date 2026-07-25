from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
print("KEY =", os.getenv("GROQ_API_KEY"))

router = APIRouter()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)


class EvaluationRequest(BaseModel):
    question: str
    answer: str


@router.post("/evaluate")
async def evaluate(request: EvaluationRequest):

    prompt = f"""
You are an expert Software Engineering interviewer.

Evaluate the following interview answer.

Question:
{request.question}

Candidate Answer:
{request.answer}

Return your response in this format:

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

    return {
        "feedback": response.choices[0].message.content
    }
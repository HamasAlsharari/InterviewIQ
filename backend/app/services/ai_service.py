import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)


def generate_questions(cv_text: str):

    prompt = f"""
You are a senior software engineering interviewer.

Read the following CV and generate exactly 5 technical interview questions.

Requirements:
- Questions must match the candidate's skills.
- Return only the questions.
- One question per line.

CV:
{cv_text}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
    )

    output = response.choices[0].message.content

    questions = [
        q.strip("-•1234567890. ").strip()
        for q in output.split("\n")
        if q.strip()
    ]

    return questions[:5]
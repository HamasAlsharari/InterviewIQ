from pydantic import BaseModel


class EvaluationRequest(BaseModel):
    question_id: int
    question: str
    answer: str
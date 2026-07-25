from pydantic import BaseModel


class InterviewRequest(BaseModel):
    cv_text: str


class InterviewResponse(BaseModel):
    status: str
    questions: list[str]
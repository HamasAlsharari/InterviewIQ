from pydantic import BaseModel


class InterviewRequest(BaseModel):
    cv_text: str
    user_id: int


class InterviewQuestionResponse(BaseModel):
    id: int
    question: str


class InterviewResponse(BaseModel):
    status: str
    interview_id: int
    questions: list[InterviewQuestionResponse]
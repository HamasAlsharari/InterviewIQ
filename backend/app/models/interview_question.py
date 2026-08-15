from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database.database import Base


class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)

    interview_id = Column(
        Integer,
        ForeignKey("interviews.id"),
        nullable=False,
    )

    question = Column(Text, nullable=False)

    answer = Column(Text, default="")

    feedback = Column(Text, default="")

    score = Column(Integer, default=0)

    interview = relationship(
        "Interview",
        back_populates="questions",
    )
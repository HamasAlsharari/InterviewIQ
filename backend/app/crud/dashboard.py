from sqlalchemy.orm import Session

from app.models.interview import Interview


def get_user_interviews(
    db: Session,
    user_id: int,
):
    return (
        db.query(Interview)
        .filter(Interview.user_id == user_id)
        .order_by(Interview.created_at.desc())
        .all()
    )
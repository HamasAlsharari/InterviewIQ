from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
import re

from app.database.database import get_db
from app.crud.dashboard import get_user_interviews
from app.models.user import User
from app.core.jwt_handler import SECRET_KEY, ALGORITHM

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


@router.get("/")
def dashboard(
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

        if email is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

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

    interviews = get_user_interviews(
        db=db,
        user_id=user.id,
    )

    result = []

    for interview in interviews:

        scores = []

        for question in interview.questions:

            match = re.search(
                r"Score:\s*(\d+(?:\.\d+)?)/10",
                question.feedback or "",
            )

            if match:
                score = float(match.group(1))
            else:
                score = float(question.score or 0)

            scores.append(score)

        average_score = (
            round(sum(scores) / len(scores), 1)
            if scores
            else 0
        )

        result.append(
            {
                "id": interview.id,
                "title": interview.title,
                "average_score": average_score,
                "created_at": interview.created_at,
            }
        )

    return result
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import UserRegister
from app.database.database import get_db
from app.models.user import User
from app.core.security import hash_password

router = APIRouter()


@router.get("/test")
def test():
    return {
        "status": "success",
        "message": "Auth Router Working!"
    }


@router.post("/register")
def register(user: UserRegister, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
    full_name=user.full_name,
    email=user.email,
    password=hash_password(user.password),
)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "status": "success",
        "message": "User registered successfully"
    }
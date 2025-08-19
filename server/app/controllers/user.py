from sqlalchemy.orm import Session
from app.db.models import User
from app.schemas.user import UserCreate
from app.lib.security import get_password_hash
from app.constants.user_types import UserType
from fastapi import HTTPException, status


def create_user(db: Session, user: UserCreate) -> User:
    # Validate user_type against the Enum
    if user.user_type not in [UserType.APPLICANT, UserType.RECRUITER]:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid user_type")

    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        user_type=user.user_type
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

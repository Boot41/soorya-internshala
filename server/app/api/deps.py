from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.lib.jwt import decode_token
from app.controllers import user as user_controller
from app.constants.user_types import UserType


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    email = payload["sub"]
    user = user_controller.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_recruiter(user=Depends(get_current_user)):
    if str(user.user_type) != UserType.RECRUITER.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only recruiters are allowed for this action")
    return user

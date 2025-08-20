from typing import Optional
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.lib.jwt import decode_token
from app.repository import user as user_repository
from app.constants.user_types import UserType

security_scheme = HTTPBearer(auto_error=True)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
    db: Session = Depends(get_db),
):
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = credentials.credentials
    payload = decode_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    email = payload["sub"]
    user = user_repository.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_recruiter(user=Depends(get_current_user)):
    if str(user.user_type) != UserType.RECRUITER.value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only recruiters are allowed for this action")
    return user

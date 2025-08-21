from fastapi import Response, Request, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserLogin
from app.repository import user as user_repository
from app.lib.jwt import create_access_token, create_refresh_token, decode_token
from app.core.config import settings


def clear_refresh_token_controller(response: Response):
    """Clears the refresh token cookie on the client.

    We scope deletion to the same path used when setting the cookie to ensure
    the browser removes the correct cookie.
    """
    response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth/refresh",
        samesite="lax",
        secure=True,
        httponly=True,
    )
    return {"message": "Logged out successfully"}


def register_user_controller(db: Session, *, user: UserCreate):
    existing = user_repository.get_user_by_email(db, email=user.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    new_user = user_repository.create_user(db=db, user=user)
    return new_user


def login_controller(response: Response, *, db: Session, user_login: UserLogin):
    user = user_repository.authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        path="/api/v1/auth/refresh",
        samesite="lax",
        secure=True,
    )

    return {"access_token": access_token, "token_type": "bearer"}


def refresh_access_token_controller(request: Request, *, db: Session):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found")

    payload = decode_token(refresh_token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    email = payload["sub"]
    user = user_repository.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    new_access_token = create_access_token(data={"sub": user.email})
    return {"access_token": new_access_token, "token_type": "bearer"}

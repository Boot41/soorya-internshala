import logging
from fastapi import Response, Request, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserLogin
from app.repository import user as user_repository
from app.lib.jwt import create_access_token, create_refresh_token, decode_token
from app.core.config import settings

logger = logging.getLogger("app.controllers.auth")


def clear_refresh_token_controller(response: Response):
    """Clears the refresh token cookie on the client.

    We scope deletion to the same path used when setting the cookie to ensure
    the browser removes the correct cookie.
    """
    logger.info("clear_refresh_token")
    response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth/refresh",
        samesite="lax",
        secure=True,
        httponly=True,
    )
    return {"message": "Logged out successfully"}


def register_user_controller(db: Session, *, user: UserCreate):
    logger.info("register_user: email=%s", user.email)
    existing = user_repository.get_user_by_email(db, email=user.email)
    if existing:
        logger.warning("register_user_conflict: email=%s", user.email)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    new_user = user_repository.create_user(db=db, user=user)
    # Be robust to test doubles that may not have all attributes
    new_user_id = getattr(new_user, "user_id", getattr(new_user, "id", None))
    new_user_email = getattr(new_user, "email", user.email)
    logger.info("user_registered: user_id=%s email=%s", new_user_id, new_user_email)
    return new_user


def login_controller(response: Response, *, db: Session, user_login: UserLogin):
    logger.info("login_attempt: email=%s", user_login.email)
    user = user_repository.authenticate_user(db, user_login.email, user_login.password)
    if not user:
        logger.warning("login_failed: email=%s", user_login.email)
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
        samesite="none",
        secure=True,
    )

    logger.info("login_success: user_id=%s email=%s", getattr(user, "user_id", None), user.email)
    return {"access_token": access_token, "token_type": "bearer"}


def refresh_access_token_controller(request: Request, *, db: Session):
    logger.debug("refresh_token_request")
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        logger.warning("refresh_token_missing")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found")

    payload = decode_token(refresh_token)
    if not payload or "sub" not in payload:
        logger.warning("refresh_token_invalid")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    email = payload["sub"]
    user = user_repository.get_user_by_email(db, email=email)
    if not user:
        logger.warning("refresh_user_not_found: email=%s", email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    new_access_token = create_access_token(data={"sub": user.email})
    logger.info("access_token_refreshed: user_id=%s email=%s", getattr(user, "user_id", None), user.email)
    return {"access_token": new_access_token, "token_type": "bearer"}

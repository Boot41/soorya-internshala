from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserRegisterResponse, Token, UserLogin
from app.controllers import user as user_controller
from app.db.session import get_db
from app.lib.jwt import create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from app.lib import security

router = APIRouter()


@router.post("/register", response_model=UserRegisterResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = user_controller.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    new_user = user_controller.create_user(db=db, user=user)
    return {"message": "User registered successfully", "user_id": new_user.user_id}


@router.post("/login", response_model=Token)
def login_for_access_token(response: Response, user_login: UserLogin, db: Session = Depends(get_db)):
    user = user_controller.authenticate_user(db, user_login.email, user_login.password)
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
        max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,  # in seconds
        expires=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,  # in seconds
        path="/api/v1/auth/refresh",
        samesite="lax",
        secure=True  # Set to True in production with HTTPS
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/refresh", response_model=Token)
def refresh_access_token(request: Request, db: Session = Depends(get_db)):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not found")
    
    payload = decode_token(refresh_token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    email = payload["sub"]
    user = user_controller.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    new_access_token = create_access_token(data={"sub": user.email})
    return {"access_token": new_access_token, "token_type": "bearer"}

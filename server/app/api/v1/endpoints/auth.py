from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserRegisterResponse, Token, UserLogin
from app.db.session import get_db
from app.controllers import auth as auth_controller

router = APIRouter()


@router.post("/register", response_model=UserRegisterResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = auth_controller.register_user_controller(db, user=user)
    return {"message": "User registered successfully", "user_id": new_user.user_id}


@router.post("/login", response_model=Token)
def login_for_access_token(response: Response, user_login: UserLogin, db: Session = Depends(get_db)):
    return auth_controller.login_controller(response, db=db, user_login=user_login)


@router.post("/refresh", response_model=Token)
def refresh_access_token(request: Request, db: Session = Depends(get_db)):
    return auth_controller.refresh_access_token_controller(request, db=db)


@router.post("/logout")
def logout(response: Response):
    result = auth_controller.clear_refresh_token_controller(response)
    return result

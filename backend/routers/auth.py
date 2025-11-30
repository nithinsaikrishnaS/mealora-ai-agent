from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from .. import database, models, auth, schemas
from datetime import timedelta
import os

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)

# Environment variables
IS_PROD = os.getenv("ENVIRONMENT") == "production"

def set_auth_cookie(response: Response, token: str, expires_minutes: int):
    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        max_age=expires_minutes * 60,
        expires=expires_minutes * 60,
        samesite="lax",
        secure=IS_PROD,
        path="/"
    )

@router.post("/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate, response: Response, db: Session = Depends(database.get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Create user
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Auto-login: Create token and set cookie
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    set_auth_cookie(response, access_token, auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    return new_user

@router.post("/login")
def login(user: schemas.UserLogin, response: Response, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # Determine expiry
    # If remember_me is True, set to 30 days (30 * 24 * 60 minutes)
    # Else use default (e.g., 30 minutes or 24 hours)
    expire_minutes = 30 * 24 * 60 if user.remember_me else auth.ACCESS_TOKEN_EXPIRE_MINUTES
    
    access_token_expires = timedelta(minutes=expire_minutes)
    access_token = auth.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    set_auth_cookie(response, access_token, expire_minutes)
    
    return {"message": "Login successful", "user": {"id": db_user.id, "email": db_user.email, "full_name": db_user.full_name}}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logout successful"}

@router.get("/me", response_model=schemas.UserOut)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

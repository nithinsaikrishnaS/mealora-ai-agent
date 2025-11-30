from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(..., min_length=2, description="Full name must be at least 2 characters")

    @validator("email")
    def normalize_email(cls, v):
        return v.strip().lower()

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

    @validator("email")
    def normalize_email(cls, v):
        return v.strip().lower()

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    
    class Config:
        orm_mode = True

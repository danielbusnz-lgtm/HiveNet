from pydantic import BaseModel
from datetime import datetime




class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserRespone(BaseModel):
    id: int
    username: str
    email: str

class TokenResponse(BaseModel):
    access_token: str

class PostCreate(BaseModel):
    content: str


class PostResponse(BaseModel):
    id: int
    content: str
    username: str
    created_at: datetime

    

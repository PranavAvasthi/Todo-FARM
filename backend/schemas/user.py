from pydantic import BaseModel, EmailStr, Field # type: ignore
from bson import ObjectId
from typing import Optional, List
from .todo import PyObjectId, TodoResponse

class UserBase(BaseModel):
    username: str
    email: EmailStr
    
class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: PyObjectId = Field(alias="_id")
    todos: List[TodoResponse] = []

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
from pydantic import BaseModel, EmailStr, Field # type: ignore
from bson import ObjectId
from typing import List
from .todo import PyObjectId

class UserBase(BaseModel):
    username: str
    email: EmailStr
    
class UserCreate(UserBase):
    password: str

class UserResponse(UserCreate):
    id: PyObjectId = Field(alias="_id")
    todos: List[PyObjectId] = []

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
from pydantic import BaseModel, Field # type: ignore
from bson import ObjectId
from typing import Optional, List
from pydantic_core import core_schema # type: ignore
from typing import Any

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, value: Any) -> ObjectId:
        if isinstance(value, ObjectId):
            return value
        if isinstance(value, str) and ObjectId.is_valid(value):
            return ObjectId(value)
        raise ValueError("Invalid ObjectId")
    
    @classmethod
    def __get_pydantic_core_schema__(
            cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        """
        Defines the core schema for FastAPI documentation.
        Creates a JSON schema representation compatible with Pydantic's requirements.
        """
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.is_instance_schema(ObjectId)
        )

class TodoBase(BaseModel):
    title: str
    completed: bool = False
    
class TodoCreate(TodoBase):
    parent_id: Optional[str] = None
    
class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    
class TodoResponse(TodoBase):
    id: PyObjectId = Field(alias="_id")
    parent_id: Optional[PyObjectId]
    children: List[PyObjectId] = []
    
    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True

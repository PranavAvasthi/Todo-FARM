from fastapi import APIRouter # type: ignore
from bson import ObjectId
from schemas.todo import TodoCreate, TodoResponse
from utils.database import db

router = APIRouter()

@router.post("/todos", response_model = TodoResponse)
async def create_todo(todo: TodoCreate):
    todo_dict = todo.dict()
    todo_dict["children"] = []

    if todo.parent_id:
        try:
            todo_dict["parent_id"] = ObjectId(todo.parent_id)
        except Exception as e:
            raise ValueError("Invalid ObjectId Format")
    
    result = await db.todos.insert_one(todo_dict)
    
    if todo.parent_id:
        await db.todos.update_one(
            {"_id": ObjectId(todo.parent_id)},
            {"$push": {"children": result.inserted_id}}
        )
    
    todo_dict["_id"] = result.inserted_id
    return todo_dict
from fastapi import APIRouter, HTTPException, Depends # type: ignore
from bson import ObjectId
from schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from utils.database import db
from typing import List
from utils.jwt_handler import get_current_user

router = APIRouter(
    tags=['Todo Routes']
)

@router.post("/todos", response_model = TodoResponse)
async def create_todo(todo: TodoCreate, user_id: str = Depends(get_current_user)):
    todo_dict = todo.dict()
    todo_dict["children"] = []
    todo_dict["user_id"] = ObjectId(user_id)

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
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"todos": result.inserted_id}}
    )
    
    todo_dict["_id"] = result.inserted_id
    return todo_dict

@router.get("/todos", response_model = List[TodoResponse])
async def get_all_todos(user_id: str = Depends(get_current_user)):
    todos = await db.todos.find({"user_id": ObjectId(user_id)}).to_list(100)
    return todos

@router.get("/todos/{todo_id}", response_model = TodoResponse)
async def get_todo_by_id(todo_id: str, user_id: str = Depends(get_current_user)):
    try:
        todo = await db.todos.find_one({"_id": ObjectId(todo_id), "user_id": ObjectId(user_id)})
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return todo

@router.patch("/todos/{todo_id}", response_model = TodoResponse)
async def update_todo(todo_id: str, todo_update: TodoUpdate, user_id: str = Depends(get_current_user)):
    todo_dict = {k: v for k, v in todo_update.dict().items() if v is not None}
    
    if "completed" in todo_dict:
        new_completed = todo_dict["completed"]
        await update_todo_helper(todo_id, new_completed, user_id)
    
    result = await db.todos.update_one({"_id": ObjectId(todo_id), "user_id": ObjectId(user_id)}, {"$set": todo_dict})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    updated_todo = await db.todos.find_one({"_id": ObjectId(todo_id), "user_id": ObjectId(user_id)})
    
    return updated_todo

async def update_todo_helper(todo_id: str, new_completed: bool, user_id: str):
    await db.todos.update_one({"_id": ObjectId(todo_id), "user_id": user_id}, {"$set": {"completed": new_completed}})
    
    parent_todo = await db.todos.find_one({"_id": ObjectId(todo_id), "user_id": ObjectId(user_id)})
    if parent_todo and "children" in parent_todo:
        for child_id in parent_todo["children"]:
            await update_todo_helper(str(child_id), new_completed, user_id)
            
@router.delete("/todos/{todo_id}", response_model = TodoResponse)
async def delete_todo(todo_id: str, user_id: str = Depends(get_current_user)):
    todo_to_delete = await db.todos.find_one({"_id": ObjectId(todo_id), "user_id": ObjectId(user_id)})
    
    if not todo_to_delete:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    await delete_todo_helper(todo_id, user_id)
    
    return todo_to_delete

async def delete_todo_helper(todo_id: str, user_id: str):
    current_todo = await db.todos.find_one({"_id": ObjectId(todo_id), "user_id": ObjectId(user_id)})
    
    if current_todo and "children" in current_todo:
        for child_id in current_todo["children"]:
            await delete_todo_helper(str(child_id), user_id)
    
    await db.todos.delete_one({"_id": ObjectId(todo_id), "user_id": ObjectId(user_id)})
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"todos": ObjectId(todo_id)}}
    )
    
    if current_todo and "parent_id" in current_todo:
        await db.todos.update_one(
            {"_id": ObjectId(current_todo["parent_id"])},
            {"$pull": {"children": ObjectId(todo_id)}}
        )
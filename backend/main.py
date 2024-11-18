from fastapi import FastAPI # type: ignore
# from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
from utils.database import client
from dotenv import load_dotenv # type: ignore
# import os
from routers import todo

load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = os.getenv("DB_NAME")

app = FastAPI()

# client = AsyncIOMotorClient(MONGO_URI)
# db = client[DB_NAME]

app.include_router(todo.router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    
# @app.get("/")
# async def home():
#     return {"message": "Hello, Testing Successfull"}

# @app.post("/test")
# async def test(data: dict):
#     result = await db.test_collection.insert_one(data)
#     return {"message": "Data inserted", "id": str(result.inserted_id)}
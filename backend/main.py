from fastapi import FastAPI # type: ignore
from utils.database import client
from dotenv import load_dotenv # type: ignore
from routers import todo

load_dotenv()

app = FastAPI()

app.include_router(todo.router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
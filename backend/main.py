from fastapi import FastAPI # type: ignore
from utils.database import client
from dotenv import load_dotenv # type: ignore
from routers import todo, auth
from fastapi.middleware.cors import CORSMiddleware # type: ignore

load_dotenv()

app = FastAPI()

app.include_router(auth.router)
app.include_router(todo.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"],  
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
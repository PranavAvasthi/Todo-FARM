from motor.motor_asyncio import AsyncIOMotorClient # type: ignore
from dotenv import load_dotenv # type: ignore
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
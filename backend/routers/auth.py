from fastapi import APIRouter, HTTPException, Response # type: ignore
from utils.database import db
from schemas.user import UserCreate, UserResponse
from utils.hashing import hash_password, verify_password
from utils.jwt_handler import create_access_token
from fastapi.security import OAuth2PasswordRequestForm # type: ignore

router = APIRouter(
    tags=["Authentication Routes"]
)

@router.post("/register", response_model = UserResponse)
async def register(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["todos"] = []
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    return user_dict

@router.post("/login")
async def login(response: Response, user: UserCreate):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    
    access_token = create_access_token(data={"sub": str(db_user["_id"])})

    response.set_cookie(key="access_token", value=access_token, httponly=True)
    return {"message": "Login successful", "access_token": access_token}
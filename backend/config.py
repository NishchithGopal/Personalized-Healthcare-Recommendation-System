import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-default-key")
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/healthcare_db")

import bcrypt
from bson.objectid import ObjectId
from models.db import db

class User:
    collection_name = 'users'

    @classmethod
    def get_collection(cls):
        return db[cls.collection_name]

    @classmethod
    def create_user(cls, name, email, password, role="user"):
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password.decode('utf-8'),
            "role": role
        }
        
        result = cls.get_collection().insert_one(user_data)
        return str(result.inserted_id)

    @classmethod
    def find_by_email(cls, email):
        return cls.get_collection().find_one({"email": email})

    @classmethod
    def find_by_id(cls, user_id):
        try:
            return cls.get_collection().find_one({"_id": ObjectId(user_id)}, {"password": 0})
        except:
            return None

    @classmethod
    def check_password(cls, hashed_password, plain_password):
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

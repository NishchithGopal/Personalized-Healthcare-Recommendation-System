from flask import Blueprint, request, jsonify, current_app
from models.user_model import User
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing required fields (name, email, password)'}), 400
        
    # Check if user already exists
    if User.find_by_email(data['email']):
        return jsonify({'message': 'User already exists with this email'}), 409
        
    try:
        user_id = User.create_user(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            role=data.get('role', 'user') # Default role is user
        )
        return jsonify({'message': 'User created successfully', 'user_id': user_id}), 201
    except Exception as e:
        return jsonify({'message': 'Error creating user', 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = User.find_by_email(data['email'])
    
    if not user or not User.check_password(user['password'], data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
        
    # Generate JWT Token (expires in 24 hours)
    token_payload = {
        'user_id': str(user['_id']),
        'role': user.get('role', 'user'),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    
    token = jwt.encode(token_payload, current_app.config['SECRET_KEY'], algorithm="HS256")
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'role': user.get('role', 'user')
        }
    }), 200

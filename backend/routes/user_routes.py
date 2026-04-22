from flask import Blueprint, jsonify
from services.auth_middleware import token_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    """
    Protected route to get user profile.
    current_user is injected by the @token_required decorator.
    """
    # Exclude password and convert ObjectId to string
    user_data = {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user.get("role", "user")
        # Add other health metrics/data if they exist
    }
    
    return jsonify({
        "message": "Profile fetched successfully",
        "profile": user_data
    }), 200

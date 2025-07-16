from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

profile_bp = Blueprint('profile', __name__)
 
@profile_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Protected endpoint to get the current user's profile using JWT authentication."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    return jsonify({'user': user.to_dict()}), 200 
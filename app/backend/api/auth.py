from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from models.user import User
from models import db
import re
import traceback

# Blueprint
auth_bp = Blueprint('auth', __name__)

# Rate limiter (attach to app in main.py)
limiter = Limiter(key_func=get_remote_address, app=None)

# Password complexity regex
PASSWORD_REGEX = re.compile(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$'
)

def sanitize_input(value):
    if not isinstance(value, str):
        return ''
    return re.sub(r'[<>"\'%;()&+]', '', value)

@auth_bp.route('/api/signup', methods=['POST'])
@limiter.limit('5 per minute')
def signup():
    try:
        data = request.get_json() or {}
        username = sanitize_input(data.get('username', '').strip())
        email = sanitize_input(data.get('email', '').strip().lower())
        password = data.get('password', '')

        # Validate required fields
        if not username or not email or not password:
            return jsonify({'error': 'All fields are required.'}), 400

        # Validate password complexity
        if not PASSWORD_REGEX.match(password):
            return jsonify({'error': 'Password must be at least 8 characters and include uppercase, lowercase, digit, and special character.'}), 400

        # Check uniqueness
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists.'}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists.'}), 400

        # Hash password
        password_hash = generate_password_hash(password)
        user = User(username=username, email=email, password_hash=password_hash)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully.'}), 201
    except Exception as e:
        current_app.logger.error(f"Signup error: {e}\n{traceback.format_exc()}")
        return jsonify({'error': 'Internal server error.'}), 500

@auth_bp.route('/api/login', methods=['POST'])
@limiter.limit('10 per minute')
def login():
    try:
        data = request.get_json() or {}
        identifier = sanitize_input(data.get('username', '') or data.get('email', '')).strip().lower()
        password = data.get('password', '')

        # Find user by username or email
        user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid credentials.'}), 401

        # Generate JWT token
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        }), 200
    except Exception as e:
        current_app.logger.error(f"Login error: {e}\n{traceback.format_exc()}")
        return jsonify({'error': 'Internal server error.'}), 500

# Attach limiter to app in main.py (add this in main.py after app creation):
# from api.auth import limiter
# limiter.init_app(app) 
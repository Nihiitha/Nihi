import os
import time
from flask import Blueprint, jsonify, request, current_app, url_for, send_from_directory, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User, db
from werkzeug.utils import secure_filename
from PIL import Image
import uuid

profile_bp = Blueprint('profile', __name__)
 
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../../uploads/profile_images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB
THUMBNAIL_SIZE = (128, 128)
PROFILE_SIZE = (400, 400)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@profile_bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    if user.profile:
        return jsonify({'profile': user.profile.to_dict()}), 200
    return jsonify({'user': user.to_dict()}), 200 

@profile_bp.route('/api/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update the current user's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided.'}), 400
    # Get or create profile
    profile = user.profile
    if not profile:
        from models.profile import Profile
        profile = Profile(user_id=user.id)
        db.session.add(profile)
    # Validate and update fields
    allowed_fields = ['bio', 'location']
    for field in allowed_fields:
        if field in data:
            value = data[field]
            if field == 'bio' and value is not None and len(value) > 500:
                return jsonify({'error': 'Bio must be 500 characters or less.'}), 400
            if field == 'location' and value is not None and len(value) > 120:
                return jsonify({'error': 'Location must be 120 characters or less.'}), 400
            setattr(profile, field, value)
    # Save changes
    db.session.commit()
    return jsonify({'profile': profile.to_dict()}), 200

@profile_bp.route('/api/profile/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found.'}), 404
    if 'image' not in request.files:
        return jsonify({'error': 'No file part.'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file.'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only jpg and png allowed.'}), 400
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    file.seek(0)
    if file_length > MAX_CONTENT_LENGTH:
        return jsonify({'error': 'File too large. Max 5MB.'}), 400
    if file:
        ext = file.filename.rsplit('.', 1)[1].lower()
        timestamp = int(time.time())
        unique_name = f"{user_id}_{timestamp}.{ext}"
        filename = secure_filename(unique_name)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        try:
            img = Image.open(file_path)
            img = img.convert('RGB')
            img.thumbnail(PROFILE_SIZE)
            img.save(file_path, format='JPEG', quality=85)
            thumb_name = f"thumb_{filename}"
            thumb_path = os.path.join(UPLOAD_FOLDER, thumb_name)
            img_thumb = img.copy()
            img_thumb.thumbnail(THUMBNAIL_SIZE)
            img_thumb.save(thumb_path, format='JPEG', quality=70)
        except Exception as e:
            os.remove(file_path)
            return jsonify({'error': 'Image processing failed.'}), 400
        profile = user.profile
        if not profile:
            from models.profile import Profile
            profile = Profile(user_id=user.id)
            db.session.add(profile)
        profile.image_url = url_for('profile.get_profile_image', filename=filename, _external=True)
        profile.thumbnail_url = url_for('profile.get_profile_image', filename=thumb_name, _external=True)
        db.session.commit()
        return jsonify({'image_url': profile.image_url, 'thumbnail_url': profile.thumbnail_url}), 200
    return jsonify({'error': 'Unknown error.'}), 400

@profile_bp.route('/api/profile/image/<filename>', methods=['GET'])
@jwt_required()
def get_profile_image(filename):
    user_id = get_jwt_identity()
    # Optionally, check if user is allowed to access this file (e.g., their own or public)
    # For now, just require authentication
    safe_path = os.path.abspath(UPLOAD_FOLDER)
    requested_path = os.path.abspath(os.path.join(UPLOAD_FOLDER, filename))
    if not requested_path.startswith(safe_path):
        abort(403)
    if not os.path.exists(requested_path):
        abort(404)
    return send_from_directory(UPLOAD_FOLDER, filename) 
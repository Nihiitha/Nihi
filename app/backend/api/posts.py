from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from models import db, Post
from models.user import User
from datetime import datetime
import os

posts_bp = Blueprint('posts', __name__)

UPLOAD_FOLDER = 'uploads/posts'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@posts_bp.route('/', methods=['POST'])
def create_post():
    user_id = request.form.get('user_id')
    content = request.form.get('content')
    file = request.files.get('media')
    from models import User
    user = None
    if user_id:
        # Try to find by id or email
        if user_id.isdigit():
            user = User.query.get(int(user_id))
        else:
            user = User.query.filter_by(email=user_id).first()
        if not user:
            # Auto-create user if not found
            user = User(email=user_id if '@' in user_id else f'{user_id}@example.com')
            db.session.add(user)
            db.session.commit()
    if not user or not content:
        return jsonify({'error': 'user_id and content are required.'}), 400
    media_url = None
    if file:
        from werkzeug.utils import secure_filename
        import os
        from datetime import datetime
        UPLOAD_FOLDER = 'uploads/posts'
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        media_url = f"/posts/media/{filename}"
    from models import Post
    post = Post(user_id=user.id, content=content, media_url=media_url)
    db.session.add(post)
    db.session.commit()
    return jsonify({'message': 'Post created successfully.'}), 201

@posts_bp.route('/media/<filename>', methods=['GET'])
def get_media(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@posts_bp.route('/', methods=['GET'])
def list_posts():
    from models.user import User
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([
        {
            'id': p.id,
            'user_id': p.user_id,
            'username': User.query.get(p.user_id).username if User.query.get(p.user_id) else None,
            'content': p.content,
            'media_url': p.media_url,
            'created_at': p.created_at.isoformat()
        } for p in posts
    ]) 
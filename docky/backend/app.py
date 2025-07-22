import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from models import db, User, Post
from werkzeug.utils import secure_filename
from datetime import datetime

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'pdf'}

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
db.init_app(app)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def create_tables():
    with app.app_context():
        db.create_all()

@app.route('/api/posts', methods=['POST'])
def create_post():
    username = request.form.get('username')
    content = request.form.get('content')
    file = request.files.get('media')
    if not username or not content:
        return jsonify({'error': 'Username and content are required.'}), 400
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()
    media_url = None
    if file and allowed_file(file.filename):
        filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        media_url = f"/api/media/{filename}"
    post = Post(user_id=user.id, content=content, media_url=media_url)
    db.session.add(post)
    db.session.commit()
    return jsonify({'message': 'Post created successfully.'}), 201

@app.route('/api/media/<filename>', methods=['GET'])
def get_media(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/posts', methods=['GET'])
def list_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify([
        {
            'id': p.id,
            'username': p.user.username,
            'content': p.content,
            'media_url': p.media_url,
            'created_at': p.created_at.isoformat()
        } for p in posts
    ])

if __name__ == '__main__':
    create_tables()
    app.run(debug=True) 
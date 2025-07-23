from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from models import db, Post
from models.user import User
from datetime import datetime
import os
from sqlalchemy import or_, desc
from collections import Counter

posts_bp = Blueprint('posts', __name__)

UPLOAD_FOLDER = 'uploads/posts'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'pdf'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@posts_bp.route('/', methods=['POST'])
def create_post():
    try:
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
                default_username = user_id if user_id.isdigit() else (user_id.split('@')[0] if '@' in user_id else user_id)
                user = User(email=user_id if '@' in user_id else f'{user_id}@example.com', username=default_username)
                db.session.add(user)
                db.session.commit()
        if not user or not content:
            print('ERROR: user_id and content are required.')
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
        return jsonify({'success': True, 'message': 'Post created successfully.'}), 201
    except Exception as e:
        print('POST CREATE ERROR:', str(e))
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/media/<filename>', methods=['GET'])
def get_media(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@posts_bp.route('/', methods=['GET'])
def list_posts():
    # Query params
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    category = request.args.get('category')
    visibility = request.args.get('visibility')
    search = request.args.get('search')
    tags = request.args.get('tags')  # comma-separated
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')

    query = Post.query

    # Filtering
    if category:
        query = query.filter(Post.category == category)
    if visibility:
        query = query.filter(Post.visibility == visibility)
    if search:
        query = query.filter(or_(Post.content.ilike(f'%{search}%'), Post.tags.ilike(f'%{search}%')))
    if tags:
        tag_list = [t.strip() for t in tags.split(',') if t.strip()]
        for tag in tag_list:
            query = query.filter(Post.tags.ilike(f'%{tag}%'))

    # Sorting
    sort_column = getattr(Post, sort_by, Post.created_at)
    if sort_order == 'desc':
        sort_column = desc(sort_column)
    query = query.order_by(sort_column)

    # Pagination
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    posts = pagination.items
    total = pagination.total
    pages = pagination.pages

    from models.user import User
    result = [
        {
            'id': p.id,
            'user_id': p.user_id,
            'username': User.query.get(p.user_id).username if User.query.get(p.user_id) else None,
            'content': p.content,
            'media_url': p.media_url,
            'created_at': p.created_at.isoformat(),
            'category': p.category,
            'tags': p.tags,
            'visibility': p.visibility,
            'likes_count': p.likes_count,
            'views_count': p.views_count
        } for p in posts
    ]
    return jsonify({
        'posts': result,
        'total': total,
        'pages': pages,
        'page': page,
        'per_page': per_page
    })

# Endpoint to get all categories
@posts_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Post.category).distinct().filter(Post.category.isnot(None)).all()
    return jsonify([c[0] for c in categories if c[0]])

# Endpoint to get popular tags
@posts_bp.route('/popular-tags', methods=['GET'])
def get_popular_tags():
    tags = db.session.query(Post.tags).filter(Post.tags.isnot(None)).all()
    tag_list = []
    for t in tags:
        if t[0]:
            tag_list.extend([tag.strip() for tag in t[0].split(',') if tag.strip()])
    counter = Counter(tag_list)
    popular = counter.most_common(20)
    return jsonify([{'tag': tag, 'count': count} for tag, count in popular])

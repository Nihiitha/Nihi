from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
from models import db
from models.user import User
from models.post import Post, PostLike, PostComment

posts_bp = Blueprint('posts', __name__, url_prefix='/api/posts')

# Configure upload settings
UPLOAD_FOLDER = 'uploads/posts'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'webm', 'ogg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    """Ensure upload folder exists"""
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_media_type(filename):
    """Determine media type from filename"""
    ext = filename.rsplit('.', 1)[1].lower()
    if ext in {'png', 'jpg', 'jpeg', 'gif', 'webp'}:
        return 'image'
    elif ext in {'mp4', 'webm', 'ogg'}:
        return 'video'
    return 'unknown'

@posts_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    """Create a new post"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({'error': 'Content is required'}), 400
        
        content = data['content'].strip()
        if not content:
            return jsonify({'error': 'Content cannot be empty'}), 400
        
        if len(content) > 5000:
            return jsonify({'error': 'Content cannot exceed 5000 characters'}), 400
        
        # Determine media type if media_url is provided
        media_url = data.get('media_url')
        media_type = None
        if media_url:
            filename = media_url.split('/')[-1]
            media_type = get_media_type(filename)
        
        # Create new post
        new_post = Post(
            user_id=current_user_id,
            content=content,
            media_url=media_url,
            media_type=media_type
        )
        
        db.session.add(new_post)
        db.session.commit()
        
        # Get user info for response
        user = User.query.get(current_user_id)
        
        return jsonify({
            'success': True,
            'post': {
                'id': new_post.id,
                'content': new_post.content,
                'media_url': new_post.media_url,
                'media_type': new_post.media_type,
                'user': {
                    'id': user.id,
                    'username': user.username
                },
                'likes_count': new_post.likes_count,
                'comments_count': new_post.comments_count,
                'created_at': new_post.created_at.isoformat() if new_post.created_at else None
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating post: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@posts_bp.route('/', methods=['GET'])
@jwt_required()
def get_posts():
    """Get all posts with pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        user_id = request.args.get('user_id', type=int)
        
        if user_id:
            # Get posts by specific user
            posts_data = Post.get_user_posts(user_id, page, per_page)
        else:
            # Get all posts for feed
            posts_data = Post.get_feed_posts(page, per_page)
        
        posts = []
        for post in posts_data.items:
            posts.append({
                'id': post.id,
                'content': post.content,
                'media_url': post.media_url,
                'media_type': post.media_type,
                'user': {
                    'id': post.user.id,
                    'username': post.user.username
                },
                'created_at': post.created_at.isoformat() if post.created_at else None,
                'likes_count': post.likes_count,
                'comments_count': post.comments_count,
                'shares_count': post.shares_count
            })
        
        return jsonify({
            'success': True,
            'posts': posts,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': posts_data.total,
                'pages': posts_data.pages,
                'has_next': posts_data.has_next,
                'has_prev': posts_data.has_prev
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting posts: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@posts_bp.route('/<int:post_id>', methods=['GET'])
@jwt_required()
def get_post(post_id):
    """Get a specific post by ID"""
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        return jsonify({
            'success': True,
            'post': post.to_dict()
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting post: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@posts_bp.route('/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    """Like or unlike a post"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        # Check if user already liked the post
        existing_like = PostLike.query.filter_by(
            post_id=post_id, 
            user_id=current_user_id
        ).first()
        
        if existing_like:
            # Unlike the post
            db.session.delete(existing_like)
            post.decrement_likes()
            liked = False
            message = 'Post unliked successfully'
        else:
            # Like the post
            new_like = PostLike(post_id=post_id, user_id=current_user_id)
            db.session.add(new_like)
            post.increment_likes()
            liked = True
            message = 'Post liked successfully'
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': message,
            'liked': liked,
            'likes_count': post.likes_count
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error liking post: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@posts_bp.route('/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    """Add a comment to a post"""
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or 'content' not in data:
            return jsonify({'error': 'Comment content is required'}), 400
        
        content = data['content'].strip()
        if not content:
            return jsonify({'error': 'Comment content cannot be empty'}), 400
        
        if len(content) > 1000:
            return jsonify({'error': 'Comment cannot exceed 1000 characters'}), 400
        
        # Check if post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        # Create new comment
        new_comment = PostComment(
            post_id=post_id,
            user_id=current_user_id,
            content=content,
            parent_id=data.get('parent_id')  # For nested comments
        )
        
        db.session.add(new_comment)
        post.increment_comments()
        db.session.commit()
        
        # Get user info for response
        user = User.query.get(current_user_id)
        
        return jsonify({
            'success': True,
            'comment': {
                'id': new_comment.id,
                'content': new_comment.content,
                'user': {
                    'id': user.id,
                    'username': user.username
                },
                'created_at': new_comment.created_at.isoformat() if new_comment.created_at else None
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error adding comment: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@posts_bp.route('/<int:post_id>/comments', methods=['GET'])
@jwt_required()
def get_comments(post_id):
    """Get comments for a post"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Check if post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        # Get comments with pagination
        comments_query = PostComment.query.filter_by(
            post_id=post_id, 
            status='active',
            parent_id=None  # Only top-level comments
        ).order_by(PostComment.created_at.desc())
        
        comments_data = comments_query.paginate(page=page, per_page=per_page, error_out=False)
        
        comments = []
        for comment in comments_data.items:
            comments.append(comment.to_dict())
        
        return jsonify({
            'success': True,
            'comments': comments,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': comments_data.total,
                'pages': comments_data.pages
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error getting comments: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@posts_bp.route('/upload-media', methods=['POST'])
@jwt_required()
def upload_media():
    """Upload media file for posts"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': f'File size exceeds {MAX_FILE_SIZE // (1024*1024)}MB limit'}), 400
        
        # Check file extension
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Ensure upload folder exists
        ensure_upload_folder()
        
        # Generate unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Return file URL
        file_url = f"/api/posts/uploads/posts/{unique_filename}"
        
        return jsonify({
            'success': True,
            'url': file_url,
            'filename': unique_filename,
            'media_type': get_media_type(filename)
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error uploading media: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@posts_bp.route('/uploads/posts/<filename>')
def serve_media(filename):
    """Serve uploaded media files"""
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        current_app.logger.error(f"Error serving media: {str(e)}")
        return jsonify({'error': 'File not found'}), 404

@posts_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """Delete a post (soft delete)"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if post exists
        post = Post.query.get(post_id)
        if not post:
            return jsonify({'error': 'Post not found'}), 404
        
        # Check if user owns the post
        if post.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized to delete this post'}), 403
        
        # Soft delete the post
        post.status = 'deleted'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Post deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting post: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500 
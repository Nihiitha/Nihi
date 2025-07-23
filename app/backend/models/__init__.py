from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, default='user')
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Add more fields as needed

class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(256), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category = db.Column(db.String(64), index=True)
    tags = db.Column(db.String(256), index=True)  # Comma-separated tags
    visibility = db.Column(db.String(32), index=True, default='public')
    likes_count = db.Column(db.Integer, default=0, index=True)
    views_count = db.Column(db.Integer, default=0, index=True)

    __table_args__ = (
        db.Index('idx_category', 'category'),
        db.Index('idx_tags', 'tags'),
        db.Index('idx_visibility', 'visibility'),
        db.Index('idx_created_at', 'created_at'),
        db.Index('idx_likes_count', 'likes_count'),
        db.Index('idx_views_count', 'views_count'),
    ) 
from datetime import datetime
from . import db

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(500), nullable=True)
    media_type = db.Column(db.String(50), nullable=True)  # 'image', 'video', etc.
    status = db.Column(db.String(20), default='active')  # 'active', 'archived', 'deleted'
    likes_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    shares_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('posts', lazy=True))
    likes = db.relationship('PostLike', backref='post', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('PostComment', backref='post', lazy=True, cascade='all, delete-orphan')
    
    # Indexes for better performance
    __table_args__ = (
        db.Index('idx_posts_user_id', 'user_id'),
        db.Index('idx_posts_created_at', 'created_at'),
        db.Index('idx_posts_status', 'status'),
        db.Index('idx_posts_likes_count', 'likes_count'),
    )
    
    def __repr__(self):
        return f'<Post {self.id} by User {self.user_id}>'
    
    def to_dict(self):
        """Convert post to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content': self.content,
            'media_url': self.media_url,
            'media_type': self.media_type,
            'status': self.status,
            'likes_count': self.likes_count,
            'comments_count': self.comments_count,
            'shares_count': self.shares_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user': self.user.to_dict() if self.user else None
        }
    
    def increment_likes(self):
        """Increment likes count"""
        self.likes_count += 1
        db.session.commit()
    
    def decrement_likes(self):
        """Decrement likes count"""
        if self.likes_count > 0:
            self.likes_count -= 1
            db.session.commit()
    
    def increment_comments(self):
        """Increment comments count"""
        self.comments_count += 1
        db.session.commit()
    
    def decrement_comments(self):
        """Decrement comments count"""
        if self.comments_count > 0:
            self.comments_count -= 1
            db.session.commit()
    
    @staticmethod
    def get_user_posts(user_id, page=1, per_page=10):
        """Get posts by user with pagination"""
        return Post.query.filter_by(user_id=user_id, status='active')\
                        .order_by(Post.created_at.desc())\
                        .paginate(page=page, per_page=per_page, error_out=False)
    
    @staticmethod
    def get_feed_posts(page=1, per_page=10):
        """Get all active posts for feed with pagination"""
        return Post.query.filter_by(status='active')\
                        .order_by(Post.created_at.desc())\
                        .paginate(page=page, per_page=per_page, error_out=False)

class PostLike(db.Model):
    __tablename__ = 'post_likes'
    
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure a user can only like a post once
    __table_args__ = (
        db.UniqueConstraint('post_id', 'user_id', name='unique_post_like'),
        db.Index('idx_post_likes_post_id', 'post_id'),
        db.Index('idx_post_likes_user_id', 'user_id'),
    )
    
    def __repr__(self):
        return f'<PostLike {self.user_id} -> Post {self.post_id}>'

class PostComment(db.Model):
    __tablename__ = 'post_comments'
    
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('post_comments.id'), nullable=True)  # For nested comments
    status = db.Column(db.String(20), default='active')  # 'active', 'deleted'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('comments', lazy=True))
    replies = db.relationship('PostComment', backref=db.backref('parent', remote_side=[id]))
    
    # Indexes
    __table_args__ = (
        db.Index('idx_post_comments_post_id', 'post_id'),
        db.Index('idx_post_comments_user_id', 'user_id'),
        db.Index('idx_post_comments_parent_id', 'parent_id'),
        db.Index('idx_post_comments_created_at', 'created_at'),
    )
    
    def __repr__(self):
        return f'<PostComment {self.id} on Post {self.post_id}>'
    
    def to_dict(self):
        """Convert comment to dictionary"""
        return {
            'id': self.id,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'content': self.content,
            'parent_id': self.parent_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'user': self.user.to_dict() if self.user else None,
            'replies_count': len(self.replies) if self.replies else 0
        }

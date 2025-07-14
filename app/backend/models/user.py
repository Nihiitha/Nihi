from werkzeug.security import generate_password_hash, check_password_hash
import re
from . import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    
    # Validation rules
    __table_args__ = (
        db.Index('idx_username', 'username'),
        db.Index('idx_email', 'email'),
    )
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        """Hash and set password with complexity validation"""
        if not self._validate_password_complexity(password):
            raise ValueError("Password does not meet complexity requirements")
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches the hash"""
        return check_password_hash(self.password_hash, password)
    
    def _validate_password_complexity(self, password):
        """
        Validate password complexity requirements:
        - At least 8 characters long
        - Contains at least one uppercase letter
        - Contains at least one lowercase letter
        - Contains at least one digit
        - Contains at least one special character
        """
        if len(password) < 8:
            return False
        
        if not re.search(r'[A-Z]', password):  # Uppercase
            return False
        
        if not re.search(r'[a-z]', password):  # Lowercase
            return False
        
        if not re.search(r'\d', password):  # Digit
            return False
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):  # Special character
            return False
        
        return True
    
    @staticmethod
    def validate_username(username):
        """Validate username format and uniqueness"""
        if not username or len(username) < 3:
            return False, "Username must be at least 3 characters long"
        
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return False, "Username can only contain letters, numbers, and underscores"
        
        # Check uniqueness
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return False, "Username already exists"
        
        return True, "Username is valid"
    
    @staticmethod
    def validate_email(email):
        """Validate email format and uniqueness"""
        if not email:
            return False, "Email is required"
        
        # Basic email format validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return False, "Invalid email format"
        
        # Check uniqueness
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return False, "Email already exists"
        
        return True, "Email is valid"
    
    def to_dict(self):
        """Convert user to dictionary (excluding password_hash)"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }


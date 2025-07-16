import os
from datetime import timedelta

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev')
    
    # Database: Use absolute path for SQLite to avoid path resolution issues
    SQLALCHEMY_DATABASE_URI = 'sqlite:////home/nihitha/Nihi/app/backend/users.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # CORS
    CORS_HEADERS = 'Content-Type' 

    # Documentation:
    # - To use MySQL, set the DATABASE_URL environment variable.
    # - For local development, SQLite will be used if MySQL is not available. 
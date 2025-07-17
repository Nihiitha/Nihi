#!/usr/bin/env python3
"""
Database Reset Script for Development
This script drops all existing tables and recreates them from scratch.
Use this for development purposes only.
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from models import db

def create_app():
    """Create a minimal Flask app for database operations"""
    app = Flask(__name__)
    app.config.from_object(Config)
    return app

def reset_database():
    """Reset the database by dropping all tables and recreating them"""
    print("🚀 Starting database reset...")
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        db.init_app(app)
        
        # Import all models to ensure they're registered
        from models.user import User
        from models.profile import Profile, Skill, Experience, Education
        from models.post import Post
        from models.job import Job
        from models.message import Message
        
        print("📋 Dropping all existing tables...")
        
        # Drop all tables
        db.drop_all()
        print("✅ All tables dropped successfully")
        
        print("🔨 Creating all tables...")
        
        # Create all tables
        db.create_all()
        print("✅ All tables created successfully")
        
        print("🎉 Database reset completed successfully!")
        print(f"📁 Database location: {app.config['SQLALCHEMY_DATABASE_URI']}")

if __name__ == "__main__":
    try:
        reset_database()
    except Exception as e:
        print(f"❌ Error resetting database: {e}")
        sys.exit(1) 
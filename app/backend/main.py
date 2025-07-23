from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
try:
    from app.backend.config import Config
except ImportError:
    from config import Config
from dotenv import load_dotenv
from models import db
from flask_jwt_extended import JWTManager

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)
app.config.from_object(Config)
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024

# Initialize extensions
CORS(app)
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Import models (after db is initialized)
from models.user import User
from models.profile import Profile, Skill, Experience, Education
from models import Post

# Register auth blueprint and limiter
from api.auth import auth_bp, limiter
app.register_blueprint(auth_bp)
limiter.init_app(app)

# Register all other blueprints
from api.profile import profile_bp
from api.posts import posts_bp
from api.feed import feed_bp
from api.jobs import jobs_bp
from api.messaging import messaging_bp

app.register_blueprint(profile_bp)
app.register_blueprint(posts_bp, url_prefix='/posts')
app.register_blueprint(feed_bp)
app.register_blueprint(jobs_bp)
app.register_blueprint(messaging_bp)

def setup_database():
    """Setup database tables"""
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully!")

def create_app():
    """Application factory function"""
    return app

if __name__ == '__main__':
    # Setup database tables
    setup_database()
    # Run the app
    app.run(debug=True) 
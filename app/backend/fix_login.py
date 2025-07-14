from models import db
from models.user import User
from main import app
from werkzeug.security import generate_password_hash

def fix_login():
    with app.app_context():
        # Clear all existing users first
        users = User.query.all()
        for user in users:
            db.session.delete(user)
        db.session.commit()
        print(f"Cleared {len(users)} existing users")
        
        # Create the user you want to test
        username = 'testuser'
        email = 'testuser@example.com'
        password = 'TestPassword123!'
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Create user
        user = User(username=username, email=email, password_hash=password_hash)
        db.session.add(user)
        db.session.commit()
        
        print('✅ Login Fixed! New user created:')
        print(f'   Username: {username}')
        print(f'   Email: {email}')
        print(f'   Password: {password}')
        print('\n🔗 Use these credentials to login')

if __name__ == "__main__":
    fix_login() 
from models import db
from models.user import User
from main import app
from werkzeug.security import generate_password_hash

def create_test_user():
    with app.app_context():
        # Check if user already exists
        existing_user = User.query.filter_by(username='testuser').first()
        if existing_user:
            print('User "testuser" already exists')
            return
        
        # Create test user
        username = 'testuser'
        email = 'testuser@example.com'
        password = 'TestPass123!'  # Meets complexity requirements
        
        # Hash password
        password_hash = generate_password_hash(password)
        
        # Create user
        user = User(username=username, email=email, password_hash=password_hash)
        db.session.add(user)
        db.session.commit()
        
        print(f'Test user created successfully!')
        print(f'Username: {username}')
        print(f'Email: {email}')
        print(f'Password: {password}')
        print('\nYou can now login with these credentials')

if __name__ == "__main__":
    create_test_user() 
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'app', 'backend')))

import unittest
try:
    from main import app, db
    from models.user import User
except ImportError:
from app.backend.main import app, db
from app.backend.models.user import User
from flask_jwt_extended import decode_token

class AuthTestCase(unittest.TestCase):
    """Test authentication endpoints: signup, login, and profile."""
    def setUp(self):
        self.app = app.test_client()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_signup_success(self):
        resp = self.app.post('/api/signup', json={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPassword123!'
        })
        self.assertEqual(resp.status_code, 201)
        self.assertIn('User created successfully', resp.get_data(as_text=True))

    def test_signup_duplicate(self):
        self.app.post('/api/signup', json={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPassword123!'
        })
        resp = self.app.post('/api/signup', json={
            'username': 'testuser',
            'email': 'test2@example.com',
            'password': 'TestPassword123!'
        })
        self.assertEqual(resp.status_code, 400)
        self.assertIn('Username already exists', resp.get_data(as_text=True))

    def test_login_success(self):
        self.app.post('/api/signup', json={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPassword123!'
        })
        resp = self.app.post('/api/login', json={
            'username': 'testuser',
            'password': 'TestPassword123!'
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertIn('token', data)
        # Decode JWT inside app context
        with app.app_context():
        decoded = decode_token(data['token'])
            self.assertEqual(decoded['sub'], '1')

    def test_login_invalid(self):
        resp = self.app.post('/api/login', json={
            'username': 'nouser',
            'password': 'wrongpass'
        })
        self.assertEqual(resp.status_code, 401)
        self.assertIn('Invalid credentials', resp.get_data(as_text=True))

    def test_profile_protected(self):
        self.app.post('/api/signup', json={
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPassword123!'
        })
        login = self.app.post('/api/login', json={
            'username': 'testuser',
            'password': 'TestPassword123!'
        })
        token = login.get_json()['token']
        # No token
        resp = self.app.get('/api/profile')
        self.assertEqual(resp.status_code, 401)
        # With token
        headers = {'Authorization': f'Bearer {token}'}
        resp = self.app.get('/api/profile', headers=headers)
        if resp.status_code != 200:
            print('Profile protected endpoint failed:', resp.status_code, resp.get_data(as_text=True))
        self.assertEqual(resp.status_code, 200)
        self.assertIn('user', resp.get_json())

if __name__ == '__main__':
    unittest.main() 
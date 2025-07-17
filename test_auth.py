import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'app', 'backend')))

import unittest
from flask_jwt_extended import decode_token
import io
from PIL import Image as PILImage
try:
    from main import app, db
    from api.auth import limiter
    from models.user import User
except ImportError:
from app.backend.main import app, db
    from app.backend.api.auth import limiter
from app.backend.models.user import User

class AuthTestCase(unittest.TestCase):
    """Test authentication endpoints: signup, login, and profile."""
    def setUp(self):
        self.app = app.test_client()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['RATELIMIT_ENABLED'] = False
        limiter.enabled = False
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

    def test_profile_update(self):
        # Signup and login
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
        headers = {'Authorization': f'Bearer {token}'}
        # Update profile with valid data
        resp = self.app.put('/api/profile', json={
            'bio': 'Hello, this is my bio.',
            'location': 'New York'
        }, headers=headers)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()['profile']
        self.assertEqual(data['bio'], 'Hello, this is my bio.')
        self.assertEqual(data['location'], 'New York')
        # Update profile with too long bio
        long_bio = 'a' * 501
        resp = self.app.put('/api/profile', json={
            'bio': long_bio
        }, headers=headers)
        self.assertEqual(resp.status_code, 400)
        self.assertIn('Bio must be 500 characters or less', resp.get_data(as_text=True))
        # Partial update
        resp = self.app.put('/api/profile', json={
            'location': 'San Francisco'
        }, headers=headers)
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()['profile']
        self.assertEqual(data['location'], 'San Francisco')

    def test_image_upload_valid(self):
        self.app.post('/api/signup', json={
            'username': 'imguser',
            'email': 'img@example.com',
            'password': 'TestPassword123!'
        })
        login = self.app.post('/api/login', json={
            'username': 'imguser',
            'password': 'TestPassword123!'
        })
        token = login.get_json()['token']
        headers = {'Authorization': f'Bearer {token}'}
        # Create a valid PNG image in memory
        img = PILImage.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        data = {'image': (img_bytes, 'test.png')}
        resp = self.app.post('/api/profile/image', content_type='multipart/form-data', headers=headers, data=data)
        self.assertEqual(resp.status_code, 200)
        self.assertIn('image_url', resp.get_json())

    def test_image_upload_invalid_type(self):
        self.app.post('/api/signup', json={
            'username': 'imguser2',
            'email': 'img2@example.com',
            'password': 'TestPassword123!'
        })
        login = self.app.post('/api/login', json={
            'username': 'imguser2',
            'password': 'TestPassword123!'
        })
        token = login.get_json()['token']
        headers = {'Authorization': f'Bearer {token}'}
        # Create a fake text file
        fake_file = io.BytesIO(b'notanimage')
        data = {'image': (fake_file, 'test.txt')}
        resp = self.app.post('/api/profile/image', content_type='multipart/form-data', headers=headers, data=data)
        self.assertEqual(resp.status_code, 400)
        self.assertIn('Invalid file type', resp.get_data(as_text=True))

    def test_image_upload_too_large(self):
        self.app.post('/api/signup', json={
            'username': 'imguser3',
            'email': 'img3@example.com',
            'password': 'TestPassword123!'
        })
        login = self.app.post('/api/login', json={
            'username': 'imguser3',
            'password': 'TestPassword123!'
        })
        token = login.get_json()['token']
        headers = {'Authorization': f'Bearer {token}'}
        # Create a large image (6MB)
        img = PILImage.new('RGB', (3000, 3000), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        data = {'image': (img_bytes, 'large.png')}
        resp = self.app.post('/api/profile/image', content_type='multipart/form-data', headers=headers, data=data)
        self.assertEqual(resp.status_code, 413)
        self.assertIn('Request Entity Too Large', resp.get_data(as_text=True))

    def test_image_upload_access_control(self):
        # Try to upload without auth
        img = PILImage.new('RGB', (100, 100), color='green')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        data = {'image': (img_bytes, 'test.png')}
        resp = self.app.post('/api/profile/image', content_type='multipart/form-data', data=data)
        self.assertEqual(resp.status_code, 401)

    def test_error_handling(self):
        self.app.post('/api/signup', json={
            'username': 'erruser',
            'email': 'err@example.com',
            'password': 'TestPassword123!'
        })
        login = self.app.post('/api/login', json={
            'username': 'erruser',
            'password': 'TestPassword123!'
        })
        token = login.get_json()['token']
        headers = {'Authorization': f'Bearer {token}'}
        # No file part
        resp = self.app.post('/api/profile/image', content_type='multipart/form-data', headers=headers)
        self.assertEqual(resp.status_code, 400)
        self.assertIn('No file part', resp.get_data(as_text=True))
        # No selected file
        data = {'image': (io.BytesIO(), '')}
        resp = self.app.post('/api/profile/image', content_type='multipart/form-data', headers=headers, data=data)
        self.assertEqual(resp.status_code, 400)
        self.assertIn('No selected file', resp.get_data(as_text=True))

    def test_rate_limiting(self):
        # Enable rate limiting for this test
        app.config['RATELIMIT_ENABLED'] = True
        limiter.enabled = True
        self.app.post('/api/signup', json={
            'username': 'rateuser',
            'email': 'rate@example.com',
            'password': 'TestPassword123!'
        })
        for _ in range(6):
            resp = self.app.post('/api/signup', json={
                'username': f'rateuser{_}',
                'email': f'rate{_}@example.com',
                'password': 'TestPassword123!'
            })
        self.assertEqual(resp.status_code, 429)
        app.config['RATELIMIT_ENABLED'] = False
        limiter.enabled = False

    def test_frontend_backend_integration(self):
        # Signup, login, update profile, upload image, get profile
        self.app.post('/api/signup', json={
            'username': 'fulluser',
            'email': 'full@example.com',
            'password': 'TestPassword123!'
        })
        login = self.app.post('/api/login', json={
            'username': 'fulluser',
            'password': 'TestPassword123!'
        })
        token = login.get_json()['token']
        headers = {'Authorization': f'Bearer {token}'}
        # Update profile
        self.app.put('/api/profile', json={
            'bio': 'Integration test bio',
            'location': 'Integration City'
        }, headers=headers)
        # Upload image
        img = PILImage.new('RGB', (100, 100), color='yellow')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        data = {'image': (img_bytes, 'test.png')}
        resp = self.app.post('/api/profile/image', content_type='multipart/form-data', headers=headers, data=data)
        self.assertEqual(resp.status_code, 200)
        # Get profile
        resp = self.app.get('/api/profile', headers=headers)
        self.assertEqual(resp.status_code, 200)
        profile = resp.get_json()['profile']
        self.assertEqual(profile['bio'], 'Integration test bio')

if __name__ == '__main__':
    unittest.main() 
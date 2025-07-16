# Authentication System

## Overview
This backend implements secure user authentication using JWT. Users can register, log in, and access protected endpoints. Passwords are hashed, and JWT tokens are used for session management.

## Endpoints

### POST /api/signup
- Registers a new user.
- Requires: username, email, password (must be strong)
- Returns: success message or error

### POST /api/login
- Authenticates user by username or email and password.
- Returns: JWT token and user info on success, error on failure.

### GET /api/profile
- Protected endpoint. Requires JWT in Authorization header.
- Returns: current user's profile info.

## JWT Usage
- On login, the backend returns a JWT token.
- The frontend stores this token (e.g., in localStorage).
- For protected endpoints, send the token as:
  `Authorization: Bearer <token>`
- If the token is missing or invalid, the backend returns 401 Unauthorized.

## Error Handling
- All endpoints return clear error messages for invalid input, duplicate users, or authentication failures.
- Internal errors are logged and return a generic error message.

## Testing
- Run `python test_auth.py` to test registration, login, and protected route access.

## Local Development
- By default, SQLite is used for local development. To use MySQL, set the `DATABASE_URL` environment variable. 
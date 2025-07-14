# Flask Backend API Test Guide

## Correct Endpoints

### 1. Signup
- **Method:** POST
- **URL:** `http://localhost:5000/api/signup`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "TestPassword123!"
}
```

### 2. Login
- **Method:** POST
- **URL:** `http://localhost:5000/api/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "testuser",
  "password": "TestPassword123!"
}
```

## Common 404 Errors

### ❌ Wrong URLs (will give 404):
- `http://localhost:5000/api/auth/signup` (wrong)
- `http://localhost:5000/signup` (wrong)
- `http://localhost:5000/api/signup/` (trailing slash)

### ✅ Correct URLs:
- `http://localhost:5000/api/signup` (correct)
- `http://localhost:5000/api/login` (correct)

## Postman Setup Steps

1. **Create New Request**
2. **Set Method to POST**
3. **Enter URL:** `http://localhost:5000/api/signup`
4. **Go to Body tab**
5. **Select "raw" and "JSON"**
6. **Paste the JSON body**
7. **Send request**

## Test with curl
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "testuser@example.com", "password": "TestPassword123!"}'
``` 
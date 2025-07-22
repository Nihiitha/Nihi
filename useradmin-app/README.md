# User/Admin Dashboard Web App

## Features
- User: Submit name and document (PDF/DOCX)
- Admin: View all submissions, download documents, see timestamps

## Tech Stack
- Backend: Flask, SQLite
- Frontend: React

## Running the App

### Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

### Frontend
cd frontend
npm install
npm start

App runs at http://localhost:3000 (frontend) and http://localhost:5000 (backend) 
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from models import db, Submission

UPLOAD_FOLDER = 'uploads'

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
db.init_app(app)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Remove @app.before_first_request and create tables before running the app
# @app.before_first_request
def create_tables():
    with app.app_context():
        db.create_all()

@app.route('/api/submit', methods=['POST'])
def submit():
    name = request.form.get('name')
    file = request.files.get('document')
    if not name or not file or not file.filename:
        return jsonify({'error': 'Name and document required'}), 400
    filename = file.filename
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    submission = Submission(name=name, filename=filename)
    db.session.add(submission)
    db.session.commit()
    return jsonify({'message': 'Submitted successfully'})

@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    submissions = Submission.query.order_by(Submission.timestamp.desc()).all()
    return jsonify([
        {
            'id': s.id,
            'name': s.name,
            'filename': s.filename,
            'timestamp': s.timestamp.isoformat()
        } for s in submissions
    ])

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

if __name__ == '__main__':
    create_tables()
    app.run(debug=True) 
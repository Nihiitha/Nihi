from flask_sqlalchemy import SQLAlchemy

# Use the same db instance as in user.py
from .user import db

class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bio = db.Column(db.Text)
    location = db.Column(db.String(120))
    image_url = db.Column(db.String(256))
    thumbnail_url = db.Column(db.String(256))
    # Relationships
    skills = db.relationship('Skill', backref='profile', lazy=True)
    experiences = db.relationship('Experience', backref='profile', lazy=True)
    educations = db.relationship('Education', backref='profile', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'bio': self.bio,
            'location': self.location,
            'image_url': self.image_url,
            'thumbnail_url': self.thumbnail_url,
            'skills': [skill.name for skill in self.skills],
            'experiences': [
                {
                    'title': exp.title,
                    'company': exp.company,
                    'start_date': exp.start_date.isoformat() if exp.start_date else None,
                    'end_date': exp.end_date.isoformat() if exp.end_date else None,
                    'description': exp.description
                } for exp in self.experiences
            ],
            'educations': [
                {
                    'school': edu.school,
                    'degree': edu.degree,
                    'field_of_study': edu.field_of_study,
                    'start_year': edu.start_year,
                    'end_year': edu.end_year
                } for edu in self.educations
            ]
        }

class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    name = db.Column(db.String(80), nullable=False)

class Experience(db.Model):
    __tablename__ = 'experiences'
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(120))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    description = db.Column(db.Text)

class Education(db.Model):
    __tablename__ = 'educations'
    id = db.Column(db.Integer, primary_key=True)
    profile_id = db.Column(db.Integer, db.ForeignKey('profiles.id'), nullable=False)
    school = db.Column(db.String(120), nullable=False)
    degree = db.Column(db.String(120))
    field_of_study = db.Column(db.String(120))
    start_year = db.Column(db.Integer)
    end_year = db.Column(db.Integer)

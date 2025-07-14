from models import db
from models.user import User
from main import app

def clear_all_users():
    with app.app_context():
        users = User.query.all()
        count = len(users)
        for user in users:
            db.session.delete(user)
        db.session.commit()
        print(f'Deleted {count} users successfully')

if __name__ == "__main__":
    clear_all_users() 
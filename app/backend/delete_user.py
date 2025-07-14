from models import db
from models.user import User
from main import app

def delete_user(username):
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            print(f'User "{username}" deleted successfully')
        else:
            print(f'User "{username}" not found')

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        username = sys.argv[1]
        delete_user(username)
    else:
        print("Usage: python delete_user.py <username>") 
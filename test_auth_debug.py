from backend import auth, models, database
from sqlalchemy.orm import Session

def test_hashing():
    print("Testing hashing...")
    try:
        hash = auth.get_password_hash("password123")
        print(f"Hash success: {hash}")
        return True
    except Exception as e:
        print(f"Hash failed: {e}")
        return False

def test_db():
    print("Testing DB...")
    db = database.SessionLocal()
    try:
        # Create tables if not exist
        models.Base.metadata.create_all(bind=database.engine)
        
        # Try to create user
        user = models.User(email="debug@example.com", full_name="Debug User", password_hash="hash")
        db.add(user)
        db.commit()
        print("DB success")
        
        # Cleanup
        db.delete(user)
        db.commit()
    except Exception as e:
        print(f"DB failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if test_hashing():
        test_db()

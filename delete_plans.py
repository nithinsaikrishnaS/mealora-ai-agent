from backend.database import SessionLocal
from backend.models import SavedPlan

def delete_all_plans():
    db = SessionLocal()
    try:
        num_deleted = db.query(SavedPlan).delete()
        db.commit()
        print(f"Deleted {num_deleted} plans.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    delete_all_plans()

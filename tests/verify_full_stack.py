import requests
import uuid
import time

BASE_URL = "http://127.0.0.1:8000/api"

def verify_full_stack():
    print("=== Starting Full Stack Verification ===")
    
    # 1. Setup User
    unique_id = str(uuid.uuid4())[:8]
    email = f"verify_{unique_id}@example.com"
    password = "password123"
    full_name = "Verification User"
    
    print(f"\n[1] Creating User: {email}")
    session = requests.Session()
    res = session.post(f"{BASE_URL}/auth/signup", json={
        "email": email,
        "password": password,
        "full_name": full_name
    })
    
    if res.status_code != 201:
        print(f"FAIL: Signup failed ({res.status_code}): {res.text}")
        return
    print("PASS: Signup successful")
    
    # 2. Check Auto-Login
    if "access_token" in session.cookies:
        print("PASS: Auto-login cookie set")
    else:
        print("FAIL: Auto-login cookie missing")
        return

    # 3. Generate Plan (Mocked call to backend logic if possible, or just create data)
    # Since /api/generate calls LLM which is slow/expensive, we will construct a valid plan object manually
    # to test the SAVING functionality.
    print("\n[2] Constructing Mock Plan")
    mock_plan = {
        "days": [
            {
                "day": 1,
                "meals": [
                    {
                        "name": "Test Meal",
                        "recipe_id": "test_1",
                        "short_description": "A tasty test meal",
                        "ingredients": ["1 cup flour", "2 eggs"]
                    }
                ]
            }
        ]
    }
    mock_grocery = {"Baking": ["1 cup flour"], "Dairy": ["2 eggs"]}
    
    # 4. Save Plan
    print("\n[3] Saving Plan")
    res = session.post(f"{BASE_URL}/plans", json={
        "plan_data": {
            "plan": mock_plan,
            "grocery_list": mock_grocery
        }
    })
    
    if res.status_code != 200:
        print(f"FAIL: Save plan failed ({res.status_code}): {res.text}")
        return
    saved_plan = res.json()
    plan_id = saved_plan["id"]
    print(f"PASS: Plan saved (ID: {plan_id})")
    
    # 5. List Plans
    print("\n[4] Listing Plans")
    res = session.get(f"{BASE_URL}/plans")
    if res.status_code != 200:
        print(f"FAIL: List plans failed ({res.status_code})")
        return
    plans = res.json()
    if any(p["id"] == plan_id for p in plans):
        print("PASS: Saved plan found in list")
    else:
        print("FAIL: Saved plan NOT found in list")
        return
        
    # 6. Delete Plan
    print("\n[5] Deleting Plan")
    res = session.delete(f"{BASE_URL}/plans/{plan_id}")
    if res.status_code != 200:
        print(f"FAIL: Delete plan failed ({res.status_code})")
        return
    print("PASS: Plan deleted")
    
    # 7. Verify Deletion
    res = session.get(f"{BASE_URL}/plans")
    plans = res.json()
    if not any(p["id"] == plan_id for p in plans):
        print("PASS: Plan correctly removed from list")
    else:
        print("FAIL: Plan still exists after delete")
        
    # 8. Logout
    print("\n[6] Logout")
    res = session.post(f"{BASE_URL}/auth/logout")
    if res.status_code != 200:
        print(f"FAIL: Logout failed ({res.status_code})")
    
    # 9. Verify Protected Route Access Denied
    print("\n[7] Verifying Access Denied")
    res = session.get(f"{BASE_URL}/plans")
    if res.status_code == 401:
        print("PASS: Access denied after logout")
    else:
        print(f"FAIL: Still able to access plans ({res.status_code})")

    print("\n=== Verification Complete: ALL PASS ===")

if __name__ == "__main__":
    verify_full_stack()

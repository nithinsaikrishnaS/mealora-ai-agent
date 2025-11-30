import requests
import uuid

BASE_URL = "http://127.0.0.1:8000/api/auth"

def test_auth_flow():
    # Generate unique email
    email = f"user_{uuid.uuid4()}@example.com"
    password = "password123"
    full_name = "Test User"

    print(f"Testing Auth Flow for {email}...")

    # 1. Signup
    print("1. Signup...")
    res = requests.post(f"{BASE_URL}/signup", json={
        "email": email,
        "password": password,
        "full_name": full_name
    })
    print(f"   Status: {res.status_code}")
    if res.status_code != 201:
        print(f"   Failed: {res.text}")
        return
    print("   Success")

    # 2. Login
    print("2. Login...")
    session = requests.Session()
    res = session.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password
    })
    print(f"   Status: {res.status_code}")
    if res.status_code != 200:
        print(f"   Failed: {res.text}")
        return
    print("   Success")
    print(f"   Cookies: {session.cookies.get_dict()}")

    # 3. Get Me (Protected)
    print("3. Get Me...")
    res = session.get(f"{BASE_URL}/me")
    print(f"   Status: {res.status_code}")
    if res.status_code != 200:
        print(f"   Failed: {res.text}")
        return
    print(f"   User: {res.json()}")

    # 4. Logout
    print("4. Logout...")
    res = session.post(f"{BASE_URL}/logout")
    print(f"   Status: {res.status_code}")
    
    # 5. Verify Logout (Get Me should fail)
    print("5. Verify Logout...")
    res = session.get(f"{BASE_URL}/me")
    print(f"   Status: {res.status_code} (Expected 401)")
    if res.status_code == 401:
        print("   Success: User is logged out")
    else:
        print("   Failed: User still has access")

if __name__ == "__main__":
    test_auth_flow()

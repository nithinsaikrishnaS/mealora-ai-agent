import requests
import uuid

BASE_URL = "http://127.0.0.1:8000/api/auth"

def test_auth_refinements():
    unique_id = str(uuid.uuid4())[:8]
    email = f"user_{unique_id}@example.com"
    password = "password123"
    full_name = "Test User"

    print(f"Testing Auth Refinements for {email}...")

    # 1. Test Invalid Email
    print("1. Testing Invalid Email...")
    res = requests.post(f"{BASE_URL}/signup", json={
        "email": "invalid-email",
        "password": password,
        "full_name": full_name
    })
    print(f"   Status: {res.status_code} (Expected 422)")
    if res.status_code == 422:
        print("   Success")
    else:
        print(f"   Failed: {res.text}")

    # 2. Test Short Password
    print("2. Testing Short Password...")
    res = requests.post(f"{BASE_URL}/signup", json={
        "email": email,
        "password": "short",
        "full_name": full_name
    })
    print(f"   Status: {res.status_code} (Expected 422)")
    if res.status_code == 422:
        print("   Success")
    else:
        print(f"   Failed: {res.text}")

    # 3. Test Signup Auto-Login
    print("3. Testing Signup Auto-Login...")
    session = requests.Session()
    res = session.post(f"{BASE_URL}/signup", json={
        "email": email,
        "password": password,
        "full_name": full_name
    })
    print(f"   Status: {res.status_code} (Expected 201)")
    if res.status_code == 201:
        print("   Success")
        # Check cookie
        if "access_token" in session.cookies:
            print("   Success: Cookie set on signup")
        else:
            print("   Failed: No cookie set")
    else:
        print(f"   Failed: {res.text}")

    # 4. Test Duplicate Email
    print("4. Testing Duplicate Email...")
    res = requests.post(f"{BASE_URL}/signup", json={
        "email": email,
        "password": password,
        "full_name": full_name
    })
    print(f"   Status: {res.status_code} (Expected 409)")
    if res.status_code == 409:
        print("   Success")
    else:
        print(f"   Failed: {res.text}")

    # 5. Test Login with Remember Me
    print("5. Testing Login with Remember Me...")
    session = requests.Session()
    res = session.post(f"{BASE_URL}/login", json={
        "email": email,
        "password": password,
        "remember_me": True
    })
    print(f"   Status: {res.status_code} (Expected 200)")
    if res.status_code == 200:
        print("   Success")
        # Check cookie expiry (hard to check exact time, but check existence)
        if "access_token" in session.cookies:
            print("   Success: Cookie set")
            # In a real browser we could check Max-Age, but requests cookiejar is simple
    else:
        print(f"   Failed: {res.text}")

if __name__ == "__main__":
    test_auth_refinements()

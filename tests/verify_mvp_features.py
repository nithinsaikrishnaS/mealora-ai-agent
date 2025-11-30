import os
import sys
import json
from app.planner import create_plan

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def verify_mvp_features():
    print("Testing MVP Features...")
    
    # Test Case 1: Vegetarian, Italian, No Peanuts
    print("\nTest Case 1: Vegetarian, Italian, No Peanuts")
    plan = create_plan(
        days=1, 
        meals_per_day=3, 
        diet="Vegetarian", 
        allergies=["Peanuts"], 
        cuisine=["Italian"], 
        budget="High"
    )
    
    # Verify Schema Fields
    print("Verifying Schema Fields...")
    day1 = plan['days'][0]
    meal1 = day1['meals'][0]
    
    if 'recipe_id' in meal1:
        print("PASS: recipe_id present")
    else:
        print("FAIL: recipe_id missing")
        
    if 'short_description' in meal1:
        print("PASS: short_description present")
    else:
        print("FAIL: short_description missing")
        
    # Verify Content (Heuristic)
    print("\nVerifying Content...")
    print(f"Meal Name: {meal1['name']}")
    print(f"Description: {meal1.get('short_description', 'N/A')}")
    print(f"Ingredients: {meal1['ingredients']}")
    
    # Check for meat (simple check)
    meat_keywords = ['chicken', 'beef', 'pork', 'salmon', 'tuna', 'steak']
    ingredients_str = " ".join(meal1['ingredients']).lower()
    if any(meat in ingredients_str for meat in meat_keywords):
        print("WARNING: Possible meat found in Vegetarian plan")
    else:
        print("PASS: No obvious meat found")

if __name__ == "__main__":
    verify_mvp_features()

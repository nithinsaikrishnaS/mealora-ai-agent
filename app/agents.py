def generate_meal_plan(preferences):
    # Mock implementation for Day 1
    return {
        "days": [
            {
                "day": i + 1,
                "meals": [
                    {
                        "name": f"Mock Indian Meal {j+1}", 
                        "ingredients": [
                            {"name": "Basmati Rice", "quantity": 1, "unit": "cup"},
                            {"name": "Chicken", "quantity": 250, "unit": "g"},
                            {"name": "Onion", "quantity": 2, "unit": "unit"},
                            {"name": "Tomato", "quantity": 2, "unit": "unit"},
                            {"name": "Ghee", "quantity": 1, "unit": "tbsp"}
                        ],
                        "recipe_id": f"mock_recipe_{j+1}",
                        "instructions": ["Sauté onions in ghee.", "Add chicken and spices.", "Cook with tomatoes.", "Serve with rice."],
                        "tags": ["Indian", "Mock"],
                        "nutrition_info": {"calories": 600, "protein": 35, "carbs": 60, "fat": 20}
                    }
                    for j in range(preferences.get('meals_per_day', 3))
                ]
            }
            for i in range(preferences.get('days', 1))
        ]
    }

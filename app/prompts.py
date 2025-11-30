MEAL_PLAN_PROMPT_TEMPLATE = """
Generate a creative and nutritious meal plan for {days} days with {meals_per_day} meals per day.

User Preferences:
- Diet: {diet}
- Allergies: {allergies}
- Cuisine: {cuisine}
- Budget: {budget}

Each meal should have:
1. A descriptive name (e.g., "Grilled Salmon with Asparagus").
2. A unique recipe_id (e.g., "recipe_001").
3. A short, appetizing description.
4. A list of ingredients with structured quantity and unit.

DO NOT use generic names like "Meal 1" or "Ingredient A". Use REAL food items.
Ensure the plan strictly adheres to the diet and allergy constraints.
For "Budget: {budget}", select ingredients that match the price range (Low = cheap staples, High = premium cuts).

**IMPORTANT: INDIAN CONTEXT**
The user is Indian. Unless specified otherwise:
- Use Indian ingredients where applicable (e.g., "Paneer", "Atta", "Basmati Rice", "Ghee", "Dal").
- Use metric units (g, kg, ml, l) or common counts (unit, bunch).
- Ensure recipes are culturally appropriate or adapted for Indian palate if generic.

Output the result in the following JSON format:
{{
  "days": [
    {{
      "day": 1,
      "meals": [
        {{
          "name": "Avocado Toast with Eggs",
          "recipe_id": "recipe_001",
          "short_description": "Creamy avocado on toasted sourdough topped with spicy eggs.",
          "ingredients": [
            {{ "name": "sourdough bread", "quantity": 2, "unit": "slice" }},
            {{ "name": "avocado", "quantity": 1, "unit": "unit" }},
            {{ "name": "eggs", "quantity": 2, "unit": "unit" }},
            {{ "name": "chili flakes", "quantity": 1, "unit": "tsp" }}
          ],
          "instructions": ["Toast the bread.", "Mash the avocado.", "Fry the eggs.", "Assemble."],
          "tags": ["Vegetarian", "High Protein"],
          "nutrition_info": {{ "calories": 450, "protein": 20, "carbs": 30, "fat": 25 }}
        }}
      ]
    }}
  ]
}}
"""

REGENERATE_MEAL_PROMPT_TEMPLATE = """
Generate a SINGLE replacement meal for: "{current_meal_name}".
It must fit these constraints:
- Diet: {diet}
- Allergies: {allergies}
- Cuisine: {cuisine}
- Budget: {budget}

The new meal should be DIFFERENT from the original.

Output strictly in this JSON format:
{{
  "name": "New Meal Name",
  "recipe_id": "new_recipe_id",
  "short_description": "Description",
  "ingredients": [
    {{ "name": "ingredient 1", "quantity": 1.5, "unit": "cup" }},
    {{ "name": "ingredient 2", "quantity": 2, "unit": "unit" }}
  ],
  "instructions": ["step 1", "step 2"],
  "tags": ["Tag1", "Tag2"],
  "nutrition_info": {{ "calories": 500, "protein": 25, "carbs": 40, "fat": 20 }}
}}
"""

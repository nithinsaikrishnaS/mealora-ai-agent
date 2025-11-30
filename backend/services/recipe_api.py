import os
import httpx
from typing import Optional, Dict, Any

class RecipeService:
    def __init__(self):
        self.spoonacular_key = os.getenv("SPOONACULAR_API_KEY")
        self.client = httpx.AsyncClient(timeout=10.0)

    async def get_recipe_by_id(self, recipe_id: str, query: str = None) -> Dict[str, Any]:
        """
        Fetches recipe details.
        Priority:
        1. Spoonacular API (if key exists and query/id is valid)
        2. Mock Data (fallback)
        """
        if self.spoonacular_key:
            try:
                # If recipe_id is a real Spoonacular ID (numeric), use it directly
                if recipe_id.isdigit():
                    return await self._fetch_spoonacular_details(recipe_id)
                
                # Otherwise, if we have a query (meal name), search for it
                if query:
                    search_id = await self._search_spoonacular(query)
                    if search_id:
                        return await self._fetch_spoonacular_details(search_id)
            except Exception as e:
                print(f"Spoonacular API failed: {e}")
                # Fallthrough to mock

        # Mock Fallback
        return self._get_mock_recipe(recipe_id, query)

    async def _search_spoonacular(self, query: str) -> Optional[str]:
        url = "https://api.spoonacular.com/recipes/complexSearch"
        params = {
            "apiKey": self.spoonacular_key,
            "query": query,
            "number": 1
        }
        resp = await self.client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
        if data.get("results"):
            return str(data["results"][0]["id"])
        return None

    async def _fetch_spoonacular_details(self, spoon_id: str) -> Dict[str, Any]:
        url = f"https://api.spoonacular.com/recipes/{spoon_id}/information"
        params = {
            "apiKey": self.spoonacular_key,
            "includeNutrition": "true"
        }
        resp = await self.client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
        
        # Normalize
        instructions = []
        if data.get("analyzedInstructions"):
            for part in data["analyzedInstructions"]:
                for step in part.get("steps", []):
                    instructions.append(step.get("step"))
        elif data.get("instructions"):
             # Simple string split if analyzed not available
             instructions = [s.strip() for s in data["instructions"].split('.') if s.strip()]

        # Nutrition
        nutrients = data.get("nutrition", {}).get("nutrients", [])
        nutrition_info = {
            "calories": 0,
            "protein": 0,
            "carbs": 0,
            "fat": 0
        }
        for n in nutrients:
            name = n.get("name").lower()
            amount = int(n.get("amount", 0))
            if name == "calories": nutrition_info["calories"] = amount
            elif name == "protein": nutrition_info["protein"] = amount
            elif name == "carbohydrates": nutrition_info["carbs"] = amount
            elif name == "fat": nutrition_info["fat"] = amount

        return {
            "recipe_id": str(data.get("id")),
            "title": data.get("title"),
            "ingredients": [
                {
                    "name": img.get("name") or img.get("originalName"),
                    "quantity": img.get("amount"),
                    "unit": img.get("unit")
                }
                for img in data.get("extendedIngredients", [])
            ],
            "instructions": instructions,
            "nutrition_info": nutrition_info,
            "source_url": data.get("sourceUrl"),
            "image": data.get("image")
        }

    def _get_mock_recipe(self, recipe_id: str, query: str = None) -> Dict[str, Any]:
        title = query if query else f"Recipe {recipe_id}"
        return {
            "recipe_id": recipe_id,
            "title": title,
            "ingredients": [
                { "name": "Mock Flour", "quantity": 2, "unit": "cup" },
                { "name": "Virtual Water", "quantity": 1, "unit": "cup" },
                { "name": "Digital Salt", "quantity": 1, "unit": "pinch" }
            ],
            "instructions": [
                "This is a SAMPLE recipe because no API key was provided.",
                "To get real recipes, add SPOONACULAR_API_KEY to your .env file.",
                "Mix the mock ingredients thoroughly.",
                "Serve with a side of debugging."
            ],
            "nutrition_info": {
                "calories": 404,
                "protein": 10,
                "carbs": 50,
                "fat": 5
            },
            "source_url": "#"
        }

recipe_service = RecipeService()

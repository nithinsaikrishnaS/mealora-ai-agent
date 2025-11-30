from fastapi import APIRouter, HTTPException, Depends
from backend.services.recipe_api import recipe_service

router = APIRouter(
    prefix="/api/recipes",
    tags=["recipes"],
    responses={404: {"description": "Not found"}},
)

@router.get("/{recipe_id}")
async def get_recipe(recipe_id: str, query: str = None):
    try:
        recipe = await recipe_service.get_recipe_by_id(recipe_id, query)
        if not recipe:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

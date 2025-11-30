from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.planner import create_plan, regenerate_meal
from app.utils import aggregate_grocery_list
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from backend.routers import auth, plans, recipes
from backend import models, database

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(plans.router)
app.include_router(recipes.router)

class Preferences(BaseModel):
    days: int
    meals_per_day: int
    diet: str
    allergies: List[str]
    cuisine: List[str]
    budget: str

class RegenerateRequest(BaseModel):
    meal_name: str
    diet: str
    allergies: List[str]
    cuisine: List[str]
    budget: str

@app.post("/api/generate")
async def generate_plan(prefs: Preferences):
    try:
        plan = create_plan(
            days=prefs.days,
            meals_per_day=prefs.meals_per_day,
            diet=prefs.diet,
            allergies=prefs.allergies,
            cuisine=prefs.cuisine,
            budget=prefs.budget
        )
        grocery_list = aggregate_grocery_list(plan)
        return {"plan": plan, "grocery_list": grocery_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/regenerate")
async def regenerate(req: RegenerateRequest):
    try:
        new_meal = regenerate_meal(
            current_meal_name=req.meal_name,
            diet=req.diet,
            allergies=req.allergies,
            cuisine=req.cuisine,
            budget=req.budget
        )
        return new_meal
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Smart Meal Planner API is running"}

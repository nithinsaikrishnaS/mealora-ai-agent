from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from backend import models, database, auth

router = APIRouter(
    prefix="/api/plans",
    tags=["plans"],
    responses={404: {"description": "Not found"}},
)

class PlanCreate(BaseModel):
    plan_data: dict

class PlanResponse(BaseModel):
    id: int
    created_at: datetime
    plan_data: dict

    class Config:
        from_attributes = True

@router.post("/", response_model=PlanResponse)
async def create_plan(
    plan: PlanCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    db_plan = models.SavedPlan(user_id=current_user.id, plan_data=plan.plan_data)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

@router.get("/", response_model=List[PlanResponse])
async def read_plans(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    plans = db.query(models.SavedPlan).filter(models.SavedPlan.user_id == current_user.id).offset(skip).limit(limit).all()
    return plans

@router.get("/{plan_id}", response_model=PlanResponse)
async def read_plan(
    plan_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    plan = db.query(models.SavedPlan).filter(models.SavedPlan.id == plan_id, models.SavedPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    # Upgrade legacy grocery list on the fly
    if plan.plan_data and 'grocery_list' in plan.plan_data:
        grocery_list = plan.plan_data['grocery_list']
        # Check if it contains strings
        needs_upgrade = False
        for cat, items in grocery_list.items():
            if items and isinstance(items[0], str):
                needs_upgrade = True
                break
        
        if needs_upgrade:
            print(f"Plan {plan_id} needs upgrade. Legacy items found.")
            # Re-aggregate using the stored plan details
            from app.utils import aggregate_grocery_list
            
            if 'plan' in plan.plan_data:
                try:
                    print("Aggregating grocery list from plan data...")
                    new_grocery_list = aggregate_grocery_list(plan.plan_data['plan'])
                    print(f"New grocery list keys: {list(new_grocery_list.keys())}")
                    
                    # Create a deep copy to ensure Pydantic sees the change
                    import copy
                    updated_data = copy.deepcopy(plan.plan_data)
                    updated_data['grocery_list'] = new_grocery_list
                    
                    # We can't modify the DB object's field in place easily if it's a MutableDict
                    # So we construct a response object manually or assign back
                    plan.plan_data = updated_data
                    print("Plan data updated successfully.")
                except Exception as e:
                    print(f"Error upgrading plan: {e}")

    return plan

@router.delete("/{plan_id}")
async def delete_plan(
    plan_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    print(f"DELETE request received for plan_id: {plan_id} from user: {current_user.email}")
    plan = db.query(models.SavedPlan).filter(models.SavedPlan.id == plan_id, models.SavedPlan.user_id == current_user.id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    db.delete(plan)
    db.commit()
    return {"ok": True}

# Ranked Hypotheses

## Task A: Add More Plan Preferences
1.  **Full Stack Update Required**: Adding preferences is not just a frontend change. It requires updating the Pydantic model (`backend/main.py`), the API interface (`frontend/lib/api.ts`), the form (`PreferencesForm.tsx`), and the LLM prompt (`app/planner.py`).
2.  **Prompt Engineering**: The LLM might ignore new preferences if the prompt isn't explicit enough about how to use them.

## Task B: "View Recipe" Shows No Content
1.  **Missing Event Handler (Confirmed)**: The button in `MealCard.tsx` has no `onClick` prop.
2.  **Missing Data**: The `Meal` object does not contain recipe steps/instructions.
3.  **Missing UI Component**: There is no modal component to show the recipe.

## Task C: Shopping List Appearance
1.  **Data Structure Mismatch**: The backend returns a list of formatted strings, but a more rich object (name, qty, unit) would allow better UI rendering.
2.  **Categorization Logic**: The simple keyword matching in `app/utils.py` puts too many items in "Pantry & Others", making the list look disorganized.
3.  **Parsing Errors**: If the ingredient parser fails, items might appear duplicated or with "0" quantity.

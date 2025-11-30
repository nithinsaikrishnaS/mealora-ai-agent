# Gap Analysis: Preferences

## Current State
The frontend form, API payload, and backend schema are currently **aligned**. All fields sent by the frontend are accepted by the backend.

## Missing Capabilities
To support *new* preferences (e.g., Calorie Target, Excluded Ingredients), changes are required across the entire stack:

1.  **Frontend (`PreferencesForm.tsx`)**: Add input fields.
2.  **Frontend State**: Update `formData` state.
3.  **API Client (`api.ts`)**: Update `Preferences` interface.
4.  **Backend Schema (`main.py`)**: Update `Preferences` Pydantic model.
5.  **Planner Logic (`app/planner.py`)**: Update `create_plan` signature and prompt template.

## Identified Gaps
-   No "Calorie Target" field.
-   No "Excluded Ingredients" field.
-   No "Macro Ratios" field.

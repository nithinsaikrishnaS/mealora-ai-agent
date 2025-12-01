# Mealora | Smart Meals. Simple Living.

Mealora is an AI-powered meal planner that creates personalized weekly meal plans and smart grocery lists based on your dietary preferences, allergies, and goals. It is designed to simplify your life by automating the planning process and helping you shop efficiently.

## Features

*   **AI-Powered Planning**: Generates unique, culturally relevant meal plans using advanced LLMs (Google Gemini).
*   **Indian Localization**: tailored for Indian households with INR pricing, metric units, and culturally appropriate meal suggestions.
*   **Smart Grocery Lists**: Automatically aggregates ingredients from your meal plan into a categorized shopping list with estimated prices.
*   **Price Estimation**: Provides estimated costs for your grocery list based on a local price database.
*   **Personalized**: Supports various diets (Vegan, Keto, Vegetarian, etc.), cuisines, and calorie goals.
*   **User Accounts**: Secure signup and login to save your preferences and plans.
*   **Plan Management**: Save your favorite plans, view details, and delete plans you no longer need.
*   **Modern UI**: Built with Next.js, Tailwind CSS, and Framer Motion for a premium, responsive experience.

## Tech Stack

*   **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, Lucide Icons, Sonner (Notifications), Radix UI.
*   **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic.
*   **Authentication**: JWT (HttpOnly Cookies), bcrypt password hashing.
*   **AI**: Google Gemini API.

## Setup Instructions

### Prerequisites

*   Python 3.9+
*   Node.js 18+
*   Google Gemini API Key

### 1. Backend Setup

1.  Navigate to the project root:
    ```bash
    cd smart-meal-planner
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Set up environment variables:
    *   Create a `.env` file in `smart-meal-planner/` (or set system env vars).
    *   Add `GEMINI_API_KEY=your_api_key_here`.
    *   (Optional) `SECRET_KEY=your_secret_key` for JWT signing.
    *   (Optional) `ENVIRONMENT=production` for secure cookie settings.
5.  Run the backend server:
    ```bash
    python -m uvicorn backend.main:app --reload --port 8000
    ```
    The API will be available at `http://localhost:8000`.

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Usage Guide

1.  **Sign Up**: Create an account to save your plans.
2.  **Plan**: Go to the "Start Planning" page. Enter your diet, calories, and other preferences.
3.  **Generate**: Click "Generate Meal Plan". The AI will create a week's worth of meals.
4.  **Shop**: Switch to the "Grocery List" tab to see what you need to buy and the estimated cost.
5.  **Save**: Click "Save Plan" to store it in your profile.
6.  **Manage**: Go to "Saved Plans" (in the user menu) to view past plans or delete them.

## Project Structure

*   `backend/`: FastAPI application, database models, authentication logic, and API routers.
*   `frontend/`: Next.js application, UI components, pages, and context providers.
*   `app/`: Core logic for LLM interaction and parsing.
*   `backend/data/`: Static data files (e.g., price database).

## License

Kaggle writeups: https://creativecommons.org/licenses/by/4.0/

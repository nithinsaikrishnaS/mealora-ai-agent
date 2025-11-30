import streamlit as st
from app.planner import create_plan, regenerate_meal
from app.utils import aggregate_grocery_list, convert_grocery_list_to_csv
from app.pdf_generator import generate_pdf
import json
from dotenv import load_dotenv
import os
import sys

# Load environment variables
load_dotenv()

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import streamlit as st
from app.planner import create_plan, regenerate_meal
from app.utils import aggregate_grocery_list, convert_grocery_list_to_csv
from app.pdf_generator import generate_pdf
import json
from dotenv import load_dotenv
import os
import sys

# Load environment variables
load_dotenv()

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

st.set_page_config(page_title="Smart Meal & Grocery Planner", layout="wide", page_icon="🥗")

# --- Shared Components ---
def sidebar_nav():
    with st.sidebar:
        st.title("🥗 Smart Planner")
        page = st.radio("Navigation", ["Home", "Planner", "Shopping", "About", "Help"])
        st.divider()
        
        # Check API Key Status
        if os.getenv("GEMINI_API_KEY"):
            st.success("🟢 AI Connected (Gemini)")
        elif os.getenv("OPENAI_API_KEY"):
            st.success("🟢 AI Connected (OpenAI)")
        else:
            st.warning("🔴 Using Mock Data (No API Key)")
        return page

# --- Pages ---

def home_page():
    st.title("Welcome to Smart Meal & Grocery Planner 🥗🛒")
    
    # Hero Section
    st.markdown("""
    ### Stop worrying about "What's for dinner?"
    Generate personalized weekly meal plans and automatic grocery lists in seconds.
    """)
    
    if st.button("🚀 Start Planning", type="primary"):
        st.session_state['page_nav'] = "Planner" # Hack to redirect if we were using state-based nav, but radio is stateless. 
        st.info("Select 'Planner' from the sidebar to get started!")

    st.divider()

    # Feature Highlights
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        st.markdown("#### 🥗 Personalized")
        st.caption("Tailored to your diet & allergies.")
    with c2:
        st.markdown("#### 💰 Budget Aware")
        st.caption("Plans that fit your wallet.")
    with c3:
        st.markdown("#### 🛒 Smart Shopping")
        st.caption("Auto-aggregated grocery lists.")
    with c4:
        st.markdown("#### 📄 Easy Export")
        st.caption("PDF, CSV, and JSON downloads.")

    st.divider()
    
    # Demo Visual
    st.image("https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", caption="Healthy, delicious meals tailored to you.")

def planner_page():
    st.title("Meal Planner 📝")
    
    # Inputs
    col1, col2 = st.columns(2)
    with col1:
        days = st.slider("Days", 1, 7, 3)
        meals_per_day = st.slider("Meals per day", 1, 5, 3)
        budget = st.select_slider("Budget Level", options=["Low", "Medium", "High"], value="Medium")
    
    with col2:
        diet = st.selectbox("Diet Type", ["Omnivore", "Vegetarian", "Vegan", "Keto", "Paleo", "Gluten-Free"])
        allergies = st.multiselect("Allergies", ["Peanuts", "Tree Nuts", "Dairy", "Gluten", "Shellfish", "Soy", "Eggs"])
        cuisine = st.multiselect("Cuisine Preferences", ["Italian", "Mexican", "Indian", "Chinese", "Japanese", "Mediterranean", "American"])

    if st.button("✨ Generate Plan", type="primary"):
        with st.spinner("Cooking up your plan... 🍳"):
            plan = create_plan(days, meals_per_day, diet, allergies, cuisine, budget)
            st.session_state['plan'] = plan
            # Save preferences for regeneration
            st.session_state['prefs'] = {'diet': diet, 'allergies': allergies, 'cuisine': cuisine, 'budget': budget}
            st.success("Plan generated! Check the 'Shopping' page for your grocery list.")

    if 'plan' in st.session_state:
        plan = st.session_state['plan']
        prefs = st.session_state.get('prefs', {})
        
        # Global Actions
        col_a, col_b = st.columns(2)
        with col_a:
            plan_json = json.dumps(plan, indent=2)
            st.download_button("📥 Download JSON", plan_json, "meal_plan.json", "application/json")
        with col_b:
             # PDF Export
            grocery_dict = aggregate_grocery_list(plan) 
            pdf_bytes = generate_pdf(plan, grocery_dict)
            st.download_button("📄 Download PDF", pdf_bytes, "meal_plan.pdf", "application/pdf")

        for d_idx, day in enumerate(plan.get('days', [])):
            with st.expander(f"Day {day['day']}", expanded=True):
                for m_idx, meal in enumerate(day.get('meals', [])):
                    c1, c2 = st.columns([3, 1])
                    with c1:
                        st.subheader(meal['name'])
                        if 'short_description' in meal:
                            st.caption(meal['short_description'])
                        st.markdown("**Ingredients:** " + ", ".join(meal['ingredients']))
                    with c2:
                        # Unique key for each button
                        if st.button("🔄 Regenerate", key=f"regen_{d_idx}_{m_idx}"):
                            with st.spinner("Regenerating..."):
                                new_meal = regenerate_meal(
                                    meal['name'], 
                                    prefs.get('diet', 'Omnivore'),
                                    prefs.get('allergies', []),
                                    prefs.get('cuisine', []),
                                    prefs.get('budget', 'Medium')
                                )
                                if new_meal:
                                    # Update state
                                    st.session_state['plan']['days'][d_idx]['meals'][m_idx] = new_meal
                                    st.rerun()
                                else:
                                    st.error("Failed to regenerate.")
    else:
        st.info("👈 Adjust preferences and click 'Generate Plan' to get started!")

def shopping_page():
    st.title("Shopping List 🛒")
    
    if 'plan' not in st.session_state:
        st.warning("⚠️ No meal plan generated yet. Go to the **Planner** page first!")
        return

    plan = st.session_state['plan']
    grocery_dict = aggregate_grocery_list(plan)
    
    # Actions
    col1, col2 = st.columns(2)
    with col1:
        csv_data = convert_grocery_list_to_csv(grocery_dict)
        st.download_button("📥 Download CSV", csv_data, "grocery_list.csv", "text/csv")
    with col2:
        pdf_bytes = generate_pdf(plan, grocery_dict)
        st.download_button("📄 Download PDF", pdf_bytes, "grocery_list.pdf", "application/pdf")
    
    st.divider()

    for category, items in grocery_dict.items():
        with st.container():
            st.subheader(f"{category}")
            cols = st.columns(3)
            for i, item in enumerate(items):
                cols[i % 3].checkbox(item, key=f"{category}_{i}")

def about_page():
    st.title("About & Architecture 🏗️")
    st.markdown("""
    ### How it Works
    This application uses a multi-stage AI pipeline to generate and process meal plans.
    
    1.  **Planner Agent**: Takes your preferences and generates a structured JSON meal plan using Google Gemini.
    2.  **Schema Validation**: Ensures the AI output matches our strict data model.
    3.  **Ingredient Parser**: Extracts structured ingredient data from the meal descriptions.
    4.  **Grocery Aggregator**: Combines ingredients, removes duplicates, and categorizes them.
    """)
    
    st.mermaid("""
    graph TD
        A[User Preferences] -->|Prompt Engineering| B(AI Planner Agent)
        B -->|JSON Output| C{Schema Validation}
        C -->|Valid Plan| D[Meal Plan Display]
        C -->|Invalid| B
        D -->|Ingredient List| E(Ingredient Parser)
        E -->|Structured Data| F(Grocery Aggregator)
        F -->|Categorized List| G[Grocery List Display]
    """)
    
    st.markdown("""
    ### Tech Stack
    - **Frontend**: Streamlit
    - **AI**: Google Gemini / OpenAI
    - **Backend Logic**: Python (Pydantic, Regex)
    - **PDF Generation**: FPDF
    """)
    
    st.info("🔒 **Privacy Note**: We do not store your personal data. All preferences are used solely for generating the current session's plan.")

def help_page():
    st.title("Help & FAQ ❓")
    
    with st.expander("How do I regenerate a meal I don't like?"):
        st.write("In the Planner view, click the '🔄 Regenerate' button next to any meal card. The AI will create a new option based on your original preferences.")
        
    with st.expander("Can I export my list?"):
        st.write("Yes! You can download your meal plan and grocery list as JSON, CSV, or PDF from the Planner or Shopping pages.")
        
    with st.expander("Why did generation fail?"):
        st.write("Sometimes the AI cannot meet very strict constraints (e.g., 'Vegan' + 'Carnivore' diet). Try relaxing your constraints or checking your API key.")
        
    st.divider()
    st.markdown("### Troubleshooting")
    st.write("If you encounter issues, try refreshing the page. Ensure your API key is correctly set in the environment variables.")
    st.markdown("Report bugs to: [GitHub Repo Link]")

# --- Main App Logic ---
page = sidebar_nav()

if page == "Home":
    home_page()
elif page == "Planner":
    planner_page()
elif page == "Shopping":
    shopping_page()
elif page == "About":
    about_page()
elif page == "Help":
    help_page()

from app.agents import generate_meal_plan as mock_generate_meal_plan
from app.llm import LLMClient
from app.prompts import MEAL_PLAN_PROMPT_TEMPLATE, REGENERATE_MEAL_PROMPT_TEMPLATE
import json
import os
import jsonschema

def create_plan(days=1, meals_per_day=3, diet="Omnivore", allergies=[], cuisine=[], budget="Medium"):
    # Check for API key
    if not (os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY")):
        print("No API key found.")
        raise Exception("API Key missing. Please set OPENAI_API_KEY or GEMINI_API_KEY to use the AI planner.")

    client = LLMClient()
    
    # Load schema
    with open(os.path.join(os.path.dirname(__file__), 'schema.json')) as f:
        schema = json.load(f)

    # Format prompt
    prompt = MEAL_PLAN_PROMPT_TEMPLATE.format(
        days=days,
        meals_per_day=meals_per_day,
        diet=diet,
        allergies=", ".join(allergies) if allergies else "None",
        cuisine=", ".join(cuisine) if cuisine else "Any",
        budget=budget
    )
    
    # Load schema for validation
    schema_path = os.path.join(os.path.dirname(__file__), 'schema.json')
    with open(schema_path, 'r') as f:
        schema = json.load(f)

    print("Generating plan with LLM...")
    try:
        plan = client.generate_json(prompt, schema)
        
        if plan:
            try:
                jsonschema.validate(instance=plan, schema=schema)
                return plan
            except jsonschema.ValidationError as e:
                print(f"LLM output validation failed: {e}")
                raise Exception(f"AI generation failed validation: {e}")
        else:
            raise Exception("AI generation returned empty response.")
            
    except Exception as e:
        print(f"LLM generation error: {e}")
        # Check for rate limit keywords
        error_str = str(e).lower()
        if "quota" in error_str or "429" in error_str or "exhausted" in error_str:
            raise Exception("API Rate Limit Exceeded. Please wait a minute and try again.")
        raise Exception(f"AI generation failed: {str(e)}")

def regenerate_meal(current_meal_name, diet="Omnivore", allergies=[], cuisine=[], budget="Medium"):
    # Check for API key
    if not (os.getenv("OPENAI_API_KEY") or os.getenv("GEMINI_API_KEY")):
        return None

    client = LLMClient()
    
    prompt = REGENERATE_MEAL_PROMPT_TEMPLATE.format(
        current_meal_name=current_meal_name,
        diet=diet,
        allergies=", ".join(allergies) if allergies else "None",
        cuisine=", ".join(cuisine) if cuisine else "Any",
        budget=budget
    )
    
    # We expect a single meal object, not the full plan schema
    # We can define a mini-schema or just let the LLM handle it with the prompt instruction
    meal = client.generate_json(prompt)
    return meal

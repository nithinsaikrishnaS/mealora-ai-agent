import re

def parse_ingredient(ingredient_string):
    """
    Parses an ingredient string into quantity, unit, and item.
    Example: "2 cups of flour" -> {'quantity': 2.0, 'unit': 'cup', 'item': 'flour'}
    """
    # Basic regex to capture number, optional unit, and item name
    # This is a simplified parser and can be improved with NLP or LLM later
    pattern = r"(\d+(?:\.\d+)?(?:\/\d+)?)\s*(?:(cup|tbsp|tsp|oz|lb|g|kg|ml|l|bunch|clove|slice|piece|can|jar|package|bag|box)s?)?\s*(?:of)?\s*(.+)"
    match = re.search(pattern, ingredient_string, re.IGNORECASE)
    
    if match:
        quantity_str = match.group(1)
        unit = match.group(2)
        item = match.group(3).strip()
        
        # Handle fractions
        if '/' in quantity_str:
            num, den = map(float, quantity_str.split('/'))
            quantity = num / den
        else:
            quantity = float(quantity_str)
            
        # Normalize unit
        if unit:
            unit = unit.lower()
            # Simple singularization
            if unit.endswith('s'):
                unit = unit[:-1]
        else:
            unit = 'unit' # Default unit if none specified
            
        return {
            "quantity": quantity,
            "unit": unit,
            "item": item
        }
    else:
        # Fallback for strings that don't match the pattern (e.g., "Salt to taste")
        return {
            "quantity": 1.0,
            "unit": "unit",
            "item": ingredient_string.strip()
        }

def parse_ingredients(ingredient_list):
    return [parse_ingredient(ing) for ing in ingredient_list]

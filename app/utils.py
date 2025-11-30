from app.parser import parse_ingredients
from backend.services.price_service import price_service

def aggregate_grocery_list(plan):
    """
    Aggregates ingredients from a meal plan into a grocery list.
    Groups by item name and sums quantities (if units match).
    """
    grocery_list = {}
    
    for day in plan.get('days', []):
        for meal in day.get('meals', []):
            ingredients = meal.get('ingredients', [])
            
            # Handle both structured (new) and string (legacy) ingredients
            processed_ingredients = []
            if ingredients and isinstance(ingredients[0], dict):
                # Already structured
                processed_ingredients = [
                    {
                        "item": ing.get("name"),
                        "quantity": float(ing.get("quantity", 0)),
                        "unit": ing.get("unit", "unit")
                    }
                    for ing in ingredients
                ]
            else:
                # Legacy strings, parse them
                processed_ingredients = parse_ingredients(ingredients)
            
            for ing in processed_ingredients:
                item = ing['item'].lower()
                unit = ing['unit'].lower() if ing['unit'] else 'unit'
                quantity = ing['quantity']
                
                # Normalize unit (basic)
                if unit in ['pcs', 'piece', 'pieces']: unit = 'unit'
                
                key = (item, unit)
                
                if key in grocery_list:
                    grocery_list[key]['quantity'] += quantity
                else:
                    grocery_list[key] = {
                        'item': ing['item'], # Keep original casing
                        'unit': unit,
                        'quantity': quantity,
                        'category': get_category(item)
                    }
    
    # Convert to list and sort by category
    result = {}
    for key, val in grocery_list.items():
        category = val['category']
        if category not in result:
            result[category] = []
        
        # Return structured object instead of string
        price = price_service.enrich_price(val['item'], val['unit'], val['quantity'])
        
        result[category].append({
            "name": val['item'],
            "quantity": val['quantity'],
            "unit": val['unit'],
            "estimated_price": price
        })
        
    return result

def get_category(item):
    """
    Simple rule-based categorization.
    """
    item = item.lower()
    if any(x in item for x in ['apple', 'banana', 'orange', 'lettuce', 'tomato', 'onion', 'carrot', 'spinach', 'pepper']):
        return 'Produce'
    elif any(x in item for x in ['milk', 'cheese', 'yogurt', 'butter', 'cream']):
        return 'Dairy'
    elif any(x in item for x in ['chicken', 'beef', 'pork', 'fish', 'egg', 'meat']):
        return 'Meat & Protein'
    elif any(x in item for x in ['bread', 'rice', 'pasta', 'flour', 'oat']):
        return 'Grains'
    elif any(x in item for x in ['can', 'jar', 'sauce', 'soup']):
        return 'Canned Goods'
    else:
        return 'Pantry & Others'

def convert_grocery_list_to_csv(grocery_dict):
    """
    Converts the aggregated grocery list dictionary to a CSV string.
    """
    csv_lines = ["Category,Item,Quantity,Unit"]
    for category, items in grocery_dict.items():
        # items is a list of strings like "2.00 unit eggs"
        # We need to parse it back or better yet, change aggregate_grocery_list to return structured data
        # For now, let's just dump the string, or slightly refactor aggregate_grocery_list
        # Actually, let's parse the string "2.00 unit eggs" assuming standard format
        for item_str in items:
            parts = item_str.split(' ', 2)
            if len(parts) == 3:
                qty, unit, name = parts
                csv_lines.append(f"{category},{name},{qty},{unit}")
            else:
                csv_lines.append(f"{category},{item_str},,")
    return "\n".join(csv_lines)

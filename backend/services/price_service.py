import json
import os

class PriceService:
    def __init__(self):
        self.prices = {}
        self._load_prices()

    def _load_prices(self):
        try:
            # Load medium budget by default for now
            path = os.path.join(os.path.dirname(__file__), '../data/prices_medium.json')
            with open(path, 'r') as f:
                self.prices = json.load(f)
        except Exception as e:
            print(f"Failed to load prices: {e}")
            self.prices = {}

    def enrich_price(self, item_name: str, unit: str, quantity: float) -> float:
        """
        Calculates estimated price. Returns None if not found.
        """
        if not item_name: return None
        
        item_lower = item_name.lower()
        unit_lower = unit.lower() if unit else 'unit'
        
        # Try to find matching item in price table
        matched_item_key = None
        if item_lower in self.prices:
            matched_item_key = item_lower
        else:
            # Partial match (e.g. "red onion" -> "onion")
            for key in self.prices:
                if key in item_lower:
                    matched_item_key = key
                    break
        
        if not matched_item_key:
            return None

        unit_prices = self.prices[matched_item_key]
        
        # 1. Direct unit match
        if unit_lower in unit_prices:
            return unit_prices[unit_lower] * quantity
            
        # 2. Unit Conversion
        # Define conversion factors to base units (kg, l, lb, cup)
        conversions = {
            'g': ('kg', 0.001),
            'gram': ('kg', 0.001),
            'grams': ('kg', 0.001),
            'kg': ('g', 1000),
            'ml': ('l', 0.001),
            'l': ('ml', 1000),
            'oz': ('lb', 0.0625),
            'ounce': ('lb', 0.0625),
            'lb': ('oz', 16),
            'tbsp': ('cup', 0.0625),
            'tsp': ('tbsp', 0.333),
            'cup': ('ml', 240) # Approx
        }
        
        if unit_lower in conversions:
            target_unit, factor = conversions[unit_lower]
            if target_unit in unit_prices:
                return unit_prices[target_unit] * (quantity * factor)
                
        # 3. Fallback to 'unit' if available (very rough)
        if 'unit' in unit_prices:
             return unit_prices['unit'] * quantity
             
        return None

price_service = PriceService()

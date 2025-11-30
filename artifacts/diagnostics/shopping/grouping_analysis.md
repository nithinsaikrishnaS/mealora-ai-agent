# Grouping Logic Analysis

## Backend (`app/utils.py`)
-   `aggregate_grocery_list` iterates through all meals and ingredients.
-   It uses `parse_ingredients` (assumed to be a regex/NLP parser) to extract item, unit, and quantity.
-   It groups items by `(item, unit)` tuple.
-   It assigns a category using `get_category(item)`, which is a simple rule-based function (e.g., "apple" -> "Produce").
-   **Output Format**: Returns a dictionary where keys are categories and values are **lists of strings** formatted as `"{quantity} {unit} {item}"`.

## Frontend (`GroceryListTab.tsx`)
-   Expects `groceryList` to be an object where values are arrays.
-   Renders each item in the array as a string.

## Potential Issues
1.  **Parsing Failures**: If `parse_ingredients` fails, it might return raw strings or incorrect units, leading to bad aggregation.
2.  **Categorization**: The rule-based categorization is very limited. Many items will fall into "Pantry & Others".
3.  **Formatting**: The backend pre-formats the string (`2.00 unit eggs`). The frontend cannot style the quantity separately from the item name.

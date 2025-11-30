from app.utils import aggregate_grocery_list

def test_aggregate_grocery_list():
    plan = {
        "days": [
            {
                "meals": [
                    {"ingredients": ["2 cups flour", "1 cup sugar"]},
                    {"ingredients": ["1 cup flour", "2 eggs"]}
                ]
            }
        ]
    }
    
    grocery_list = aggregate_grocery_list(plan)
    
    # Check Grains category
    assert "Grains" in grocery_list
    assert "3.00 cup flour" in grocery_list["Grains"]
    
    # Check Pantry category (sugar might fall here or Grains depending on logic, let's check Pantry & Others)
    # Actually sugar isn't in my simple category list, so it should be Pantry & Others
    assert "Pantry & Others" in grocery_list
    assert "1.00 cup sugar" in grocery_list["Pantry & Others"]
    
    # Check Meat & Protein
    assert "Meat & Protein" in grocery_list
    assert "2.00 unit eggs" in grocery_list["Meat & Protein"]

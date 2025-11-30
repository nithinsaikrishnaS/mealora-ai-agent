from app.parser import parse_ingredient

def test_parse_simple_ingredient():
    result = parse_ingredient("2 cups of flour")
    assert result['quantity'] == 2.0
    assert result['unit'] == 'cup'
    assert result['item'] == 'flour'

def test_parse_fraction():
    result = parse_ingredient("1/2 tsp salt")
    assert result['quantity'] == 0.5
    assert result['unit'] == 'tsp'
    assert result['item'] == 'salt'

def test_parse_decimal():
    result = parse_ingredient("1.5 kg chicken")
    assert result['quantity'] == 1.5
    assert result['unit'] == 'kg'
    assert result['item'] == 'chicken'

def test_parse_no_unit():
    result = parse_ingredient("2 onions")
    assert result['quantity'] == 2.0
    assert result['unit'] == 'unit'
    assert result['item'] == 'onions' # Regex captures 'onions' as item if unit group is missing

def test_parse_fallback():
    result = parse_ingredient("Salt to taste")
    assert result['quantity'] == 1.0
    assert result['unit'] == 'unit'
    assert result['item'] == 'Salt to taste'

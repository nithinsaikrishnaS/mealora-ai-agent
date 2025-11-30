from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Smart Meal & Grocery Planner', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_pdf(plan, grocery_dict):
    pdf = PDF()
    pdf.add_page()
    
    # Meal Plan Section
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Meal Plan', 0, 1, 'L')
    pdf.ln(5)
    
    pdf.set_font('Arial', '', 10)
    for day in plan.get('days', []):
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 10, f"Day {day['day']}", 0, 1, 'L')
        pdf.set_font('Arial', '', 10)
        
        for meal in day.get('meals', []):
            pdf.set_font('Arial', 'B', 10)
            pdf.cell(0, 8, f"  {meal['name']}", 0, 1, 'L')
            pdf.set_font('Arial', 'I', 9)
            if 'short_description' in meal:
                pdf.multi_cell(0, 5, f"  {meal['short_description']}")
            pdf.set_font('Arial', '', 9)
            ingredients = ", ".join(meal['ingredients'])
            pdf.multi_cell(0, 5, f"  Ingredients: {ingredients}")
            pdf.ln(2)
        pdf.ln(5)

    pdf.add_page()
    
    # Grocery List Section
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Grocery List', 0, 1, 'L')
    pdf.ln(5)
    
    pdf.set_font('Arial', '', 10)
    for category, items in grocery_dict.items():
        pdf.set_font('Arial', 'B', 10)
        pdf.cell(0, 8, category, 0, 1, 'L')
        pdf.set_font('Arial', '', 10)
        for item in items:
            pdf.cell(0, 5, f"- {item}", 0, 1, 'L')
        pdf.ln(3)
        
    return pdf.output(dest='S').encode('latin-1')

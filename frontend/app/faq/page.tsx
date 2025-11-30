import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
    const faqs = [
        {
            question: "How does Mealora generate meal plans?",
            answer: "Mealora uses advanced AI to analyze your dietary preferences, allergies, and goals to create personalized weekly meal plans just for you."
        },
        {
            question: "Is the grocery list automatically generated?",
            answer: "Yes! Once your meal plan is created, we automatically aggregate all the ingredients you need into a categorized grocery list."
        },
        {
            question: "Can I save my meal plans?",
            answer: "Absolutely. You can save your favorite meal plans to your profile and access them anytime."
        },
        {
            question: "Is Mealora free to use?",
            answer: "Yes, Mealora is currently free to use for all users."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 container px-4 md:px-6 py-12 max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold font-heading mb-8 text-center">Frequently Asked Questions</h1>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </main>
            <Footer />
        </div>
    );
}

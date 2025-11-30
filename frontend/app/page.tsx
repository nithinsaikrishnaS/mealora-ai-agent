import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, Sparkles, Utensils, CheckCircle, ChevronRight, Heart, Users, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
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
    <div className="min-h-screen flex flex-col font-sans scroll-smooth">
      <Navbar />

      <main className="flex-1">
        {/* SECTION 1: HERO */}
        <section id="home" className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-secondary/20 to-transparent">
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm text-primary text-sm font-medium">
                  <Sparkles className="h-4 w-4" /> Smart Meals. Simple Living.
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-foreground font-heading">
                  Plan Better. <br />
                  <span className="text-primary">Eat Smarter.</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-[600px] leading-relaxed">
                  Mealora creates personalized meal plans and smart grocery lists—designed around your lifestyle, preferences, and health.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/planner">
                    <Button size="lg" className="text-lg px-8 shadow-xl shadow-primary/20">
                      Start Planning
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button variant="outline" size="lg" className="text-lg px-8">
                      See How It Works
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white" />
                    ))}
                  </div>
                  <p>Trusted by 10,000+ healthy eaters</p>
                </div>
              </div>

              <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
                <div className="relative h-[450px] w-[450px] mx-auto lg:h-[600px] lg:w-[600px]">
                  <Image
                    src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Healthy Meal Bowl"
                    fill
                    className="object-cover rounded-full shadow-2xl z-10 relative"
                    priority
                  />
                  {/* Floating Elements */}
                  <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-lg z-20 animate-bounce duration-[3000ms]">
                    <span className="text-2xl">🥑</span>
                  </div>
                  <div className="absolute bottom-20 left-0 bg-white p-4 rounded-2xl shadow-lg z-20 animate-bounce duration-[4000ms]">
                    <span className="text-2xl">🥗</span>
                  </div>

                  {/* Decorative blobs */}
                  <div className="absolute top-0 right-0 h-64 w-64 bg-secondary rounded-full -z-10 blur-3xl opacity-50" />
                  <div className="absolute bottom-0 left-0 h-64 w-64 bg-accent rounded-full -z-10 blur-3xl opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: FEATURE HIGHLIGHTS */}
        <section className="py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Utensils, title: "Personalized Plans", desc: "Tailored to your diet, allergies, and taste." },
                { icon: CheckCircle, title: "Smart Grocery Lists", desc: "Auto-aggregated lists to save you time." },
                { icon: Heart, title: "Healthy Choices", desc: "Nutritionally balanced meals for every day." },
              ].map((feature, i) => (
                <Card key={i} className="group hover:bg-secondary/10 border-none shadow-none hover:shadow-none transition-colors">
                  <CardContent className="pt-8">
                    <div className="mb-6 inline-flex p-4 rounded-2xl bg-secondary/30 text-primary group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 font-heading">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-primary text-white overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">How Mealora Works</h2>
              <p className="text-white/80 text-lg">Three simple steps to a healthier you.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-white/30 border-t-2 border-dashed border-white/30 z-0" />

              {[
                { step: "1", title: "Set Preferences", desc: "Tell us what you love to eat." },
                { step: "2", title: "Generate Plan", desc: "Get your weekly menu instantly." },
                { step: "3", title: "Shop & Cook", desc: "Use our smart list to shop." },
              ].map((item, i) => (
                <div key={i} className="text-center relative z-10">
                  <div className="w-24 h-24 mx-auto bg-white text-primary rounded-full flex items-center justify-center text-3xl font-bold shadow-xl mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-heading">{item.title}</h3>
                  <p className="text-white/80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: MEAL CATEGORIES */}
        <section className="py-20 bg-background border-b border-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {["Vegan", "Keto", "Gluten-Free", "High Protein", "Budget Friendly", "Quick & Easy", "Family Size"].map((cat, i) => (
                <div key={i} className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer font-medium shadow-sm">
                  {cat}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: ABOUT ME */}
        <section id="about" className="py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-foreground">About Me</h2>
              <p className="text-xl text-gray-600 max-w-[800px] mx-auto leading-relaxed">
                We believe that eating healthy should be simple, accessible, and delicious for everyone.
                Mealora combines smart technology with nutritional expertise to transform how you plan your meals.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: "Health First", desc: "Nutrition is at the core of every decision we make." },
                { icon: Leaf, title: "Sustainability", desc: "Promoting ingredients that are good for you and the planet." },
                { icon: Users, title: "Community", desc: "Building a supportive space for healthy living." },
              ].map((item, i) => (
                <Card key={i} className="text-center border-none shadow-sm hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-heading">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: FAQ */}
        <section id="faq" className="py-24 bg-secondary/10">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-12 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full bg-white rounded-xl p-6 shadow-sm">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* SECTION 7: CONTACT */}
        <section id="contact" className="py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">Get in Touch</h2>
              <p className="text-xl text-gray-600">Have questions? We'd love to hear from you.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="space-y-8">
                <Card className="border-none shadow-md">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold font-heading">Email Us</h3>
                        <p className="text-gray-600">support@mealora.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold font-heading">Call Us</h3>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold font-heading">Visit Us</h3>
                        <p className="text-gray-600">123 Healthy Way, Food City, FC 90210</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <input type="text" className="w-full p-2 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <input type="text" className="w-full p-2 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input type="email" className="w-full p-2 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea rows={4} className="w-full p-2 rounded-md border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SECTION 8: FINAL CTA */}
        <section className="py-32 bg-secondary/30 relative overflow-hidden">
          <div className="container text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground font-heading">
              Let’s make healthy eating effortless.
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-[600px] mx-auto">
              Join Mealora today and take the stress out of meal planning.
            </p>
            <Link href="/planner">
              <Button size="lg" className="h-16 px-12 text-xl rounded-full shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                Start Planning Free
              </Button>
            </Link>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 to-transparent -z-10" />
        </section>
      </main>

      <Footer />
    </div>
  );
}

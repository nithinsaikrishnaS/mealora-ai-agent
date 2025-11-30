import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Leaf } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />

            <main className="flex-1">
                {/* Hero */}
                <section className="py-20 bg-secondary/20">
                    <div className="container px-4 md:px-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-foreground">
                            About Me
                        </h1>
                        <p className="text-xl text-gray-600 max-w-[800px] mx-auto leading-relaxed">
                            We believe that eating healthy should be simple, accessible, and delicious for everyone.
                            Mealora combines smart technology with nutritional expertise to transform how you plan your meals.
                        </p>
                    </div>
                </section>

                {/* Values */}
                <section className="py-20 bg-white">
                    <div className="container px-4 md:px-6">
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

                {/* Story */}
                <section className="py-20 bg-background">
                    <div className="container px-4 md:px-6">
                        <div className="max-w-[800px] mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
                            <h2 className="text-3xl font-bold font-heading mb-8 text-center text-foreground">Our Story</h2>
                            <p>
                                Mealora started with a simple question: "Why is meal planning so hard?"
                                Between dietary restrictions, budget constraints, and the endless search for recipes,
                                eating well felt like a full-time job.
                            </p>
                            <p>
                                We set out to change that. By leveraging AI to understand your unique needs,
                                we created a platform that does the heavy lifting for you. No more spreadsheet planning
                                or last-minute takeout. Just good food, planned for you.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

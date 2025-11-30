import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 py-20 bg-background">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-foreground">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-600">
                            Have questions? We'd love to hear from you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
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

                        {/* Contact Form */}
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
            </main>

            <Footer />
        </div>
    );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Preferences } from "@/lib/api";

export function PreferencesForm({ onSubmit, loading }: { onSubmit: (data: Preferences) => void; loading: boolean }) {
    const [formData, setFormData] = useState<Preferences>({
        days: 3,
        meals_per_day: 3,
        diet: "Omnivore",
        allergies: [],
        cuisine: [],
        budget: "Medium"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleAllergyChange = (allergy: string) => {
        setFormData(prev => ({
            ...prev,
            allergies: prev.allergies.includes(allergy)
                ? prev.allergies.filter(a => a !== allergy)
                : [...prev.allergies, allergy]
        }));
    };

    const handleCuisineChange = (c: string) => {
        setFormData(prev => ({
            ...prev,
            cuisine: prev.cuisine.includes(c)
                ? prev.cuisine.filter(i => i !== c)
                : [...prev.cuisine, c]
        }));
    };

    return (
        <Card className="h-fit sticky top-24">
            <CardHeader>
                <CardTitle>Plan Preferences</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Diet Type</label>
                        <select
                            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.diet}
                            onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                        >
                            <option>Omnivore</option>
                            <option>Vegetarian</option>
                            <option>Vegan</option>
                            <option>Keto</option>
                            <option>Paleo</option>
                            <option>Gluten-Free</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Allergies</label>
                        <div className="flex flex-wrap gap-2">
                            {["Peanuts", "Tree Nuts", "Dairy", "Gluten", "Shellfish", "Soy", "Eggs"].map((allergy) => (
                                <button
                                    key={allergy}
                                    type="button"
                                    onClick={() => handleAllergyChange(allergy)}
                                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${formData.allergies.includes(allergy)
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                                        }`}
                                >
                                    {allergy}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cuisine</label>
                        <div className="flex flex-wrap gap-2">
                            {["Indian", "Italian", "Mexican", "Chinese", "Japanese", "Mediterranean", "American"].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => handleCuisineChange(c)}
                                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${formData.cuisine.includes(c)
                                        ? "bg-accent text-white border-accent"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-accent"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Budget</label>
                        <div className="flex gap-4">
                            {['Low', 'Medium', 'High'].map((b) => (
                                <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                                    <input
                                        type="radio"
                                        name="budget"
                                        value={b}
                                        checked={formData.budget === b}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="accent-primary"
                                    />
                                    {b}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Days: {formData.days}</label>
                        <input
                            type="range"
                            min="1"
                            max="7"
                            value={formData.days}
                            onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                            className="w-full accent-primary"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Generating..." : "Generate Plan"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

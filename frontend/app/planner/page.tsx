"use client";

import { BackArrow } from "@/components/ui/back-arrow";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { PreferencesForm } from "@/components/planner/PreferencesForm";
import { MealPlanTab } from "@/components/planner/MealPlanTab";
import { GroceryListTab } from "@/components/planner/GroceryListTab";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { toast } from "sonner";

import { generatePlan } from "@/lib/api";

export default function PlannerPage() {
    const [activeTab, setActiveTab] = useState<"plan" | "grocery">("plan");
    const [plan, setPlan] = useState<any>(null);
    const [groceryList, setGroceryList] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login?returnTo=/planner");
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Prevent flashing content before redirect
    }

    const handleGenerate = async (prefs: any) => {
        setLoading(true);
        setError(null);
        try {
            const data = await generatePlan(prefs);
            setPlan(data.plan);
            setGroceryList(data.grocery_list);
        } catch (err) {
            setError("Failed to generate plan. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            alert("Please login to save your plan.");
            router.push("/auth/login");
            return;
        }

        if (!plan) return;

        setSaving(true);
        const toastId = toast.loading("Saving plan...");
        try {
            const res = await fetch("/api/plans/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan_data: { plan, grocery_list: groceryList } }),
                credentials: "include", // Important for sending cookies!
            });

            console.log("Save response status:", res.status);

            if (res.ok) {
                const data = await res.json();
                console.log("Plan saved:", data);
                toast.success("Plan saved successfully!", { id: toastId });
            } else {
                const errorText = await res.text();
                console.error("Save failed:", errorText);
                throw new Error("Failed to save plan: " + errorText);
            }
        } catch (err) {
            toast.error("Failed to save plan", { id: toastId, description: "Please try again." });
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 container px-4 md:px-6 py-8">
                <BackArrow />
                <div className="grid lg:grid-cols-[350px_1fr] gap-8 items-start">
                    {/* Sidebar */}
                    <aside className="lg:sticky lg:top-24">
                        <PreferencesForm onSubmit={handleGenerate} loading={loading} />
                    </aside>

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Tabs & Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex p-1 bg-white rounded-lg border shadow-sm w-fit">
                                <button
                                    onClick={() => setActiveTab("plan")}
                                    className={cn(
                                        "px-6 py-2 text-sm font-medium rounded-md transition-all",
                                        activeTab === "plan" ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:text-primary"
                                    )}
                                >
                                    Meal Plan
                                </button>
                                <button
                                    onClick={() => setActiveTab("grocery")}
                                    className={cn(
                                        "px-6 py-2 text-sm font-medium rounded-md transition-all",
                                        activeTab === "grocery" ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:text-primary"
                                    )}
                                >
                                    Grocery List
                                </button>
                            </div>

                            {plan && (
                                <Button onClick={handleSave} disabled={saving} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {saving ? "Saving..." : "Save Plan"}
                                </Button>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Tab Content */}
                        <div className="min-h-[500px]">
                            {activeTab === "plan" ? (
                                <MealPlanTab plan={plan} />
                            ) : (
                                <GroceryListTab groceryList={groceryList} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

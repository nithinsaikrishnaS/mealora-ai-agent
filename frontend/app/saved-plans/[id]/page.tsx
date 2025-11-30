"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { MealPlanTab } from "@/components/planner/MealPlanTab";
import { GroceryListTab } from "@/components/planner/GroceryListTab";
import { cn } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function SavedPlanDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState<"plan" | "grocery">("plan");

    useEffect(() => {
        if (params.id) {
            fetchPlan(params.id as string);
        }
    }, [params.id]);

    const fetchPlan = async (id: string) => {
        try {
            // Since we don't have a specific GET /api/plans/:id endpoint yet (only list),
            // we can fetch all and find it, OR implement the endpoint.
            // Actually, the backend router DOES have GET /api/plans (list) and DELETE.
            // It does NOT have GET /api/plans/:id.
            // I should implement GET /api/plans/:id in the backend first for efficiency,
            // but for now I'll fetch all and filter to avoid backend restart if possible.
            // Wait, I can easily add the endpoint. But let's check the backend router code I wrote.
            // I wrote: @router.get("/", ...) and @router.delete("/{plan_id}", ...).
            // I did NOT write @router.get("/{plan_id}").
            // So I will fetch all and filter. It's an MVP.

            const res = await fetch(`/api/plans/${id}`, { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setPlan(data);
            } else {
                if (res.status === 404) {
                    router.push("/saved-plans");
                } else {
                    router.push("/auth/login");
                }
            }
        } catch (error) {
            console.error("Failed to fetch plan", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        setDeleting(true);
        const toastId = toast.loading("Deleting plan...");

        try {
            // Remove trailing slash to match backend route exactly /api/plans/{id}
            const res = await fetch(`/api/plans/${params.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                toast.dismiss(toastId);
                toast.success("Plan deleted successfully");
                // Wait a bit for the user to see the success message
                setTimeout(() => {
                    router.push("/saved-plans");
                }, 1500);
            } else {
                toast.dismiss(toastId);
                toast.error("Failed to delete plan");
            }
        } catch (error) {
            console.error("Failed to delete plan", error);
            toast.dismiss(toastId);
            toast.error("An error occurred");
        } finally {
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!plan) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 container px-4 md:px-6 py-8">
                <div className="mb-8">
                    <Link href="/saved-plans" className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-4">
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Saved Plans
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-heading font-bold">Meal Plan #{plan.id}</h1>
                            <p className="text-gray-500 flex items-center mt-2">
                                <Calendar className="mr-2 h-4 w-4" />
                                Created on {new Date(plan.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                onClick={() => setShowDeleteConfirm(true)}
                                title="Delete Plan"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <div className="flex p-1 bg-white rounded-lg border shadow-sm">
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
                        </div>
                    </div>
                </div>

                <div className="min-h-[500px]">
                    {activeTab === "plan" ? (
                        <MealPlanTab plan={plan.plan_data.plan} />
                    ) : (
                        <GroceryListTab groceryList={plan.plan_data.grocery_list} />
                    )}
                </div>
            </main>
            <Footer />

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Meal Plan</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this meal plan? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

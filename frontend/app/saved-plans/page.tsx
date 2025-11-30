"use client";

import { useEffect, useState } from "react";
import { BackArrow } from "@/components/ui/back-arrow";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface SavedPlan {
    id: number;
    created_at: string;
    plan_data: {
        plan: any;
        grocery_list: any;
    };
}

export default function SavedPlansPage() {
    const [plans, setPlans] = useState<SavedPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
            return;
        }

        if (user) {
            fetchPlans();
        }
    }, [user, authLoading]);

    const fetchPlans = async () => {
        try {
            const res = await fetch("/api/plans", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (error) {
            console.error("Failed to fetch plans", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteConfirmationId) return;

        const id = deleteConfirmationId;
        setDeletingId(id); // Use this for loading state if needed, or just rely on toast
        const toastId = toast.loading("Deleting plan...");

        try {
            // Remove trailing slash to match backend route exactly /api/plans/{id}
            const res = await fetch(`/api/plans/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                toast.dismiss(toastId);
                toast.success("Plan deleted successfully");
                setPlans(plans.filter((p) => p.id !== id));
            } else {
                const text = await res.text();
                console.error("Delete failed:", text);
                toast.dismiss(toastId);
                toast.error("Failed to delete plan", { description: "Please try again." });
            }
        } catch (error) {
            console.error("Failed to delete plan", error);
            toast.dismiss(toastId);
            toast.error("An error occurred");
        } finally {
            setDeletingId(null);
            setDeleteConfirmationId(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 container px-4 md:px-6 py-8">
                {plans.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">You haven't saved any meal plans yet.</p>
                        <Link href="/planner">
                            <Button variant="outline">Start Planning</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium">
                                        Meal Plan #{plan.id}
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 z-10 relative"
                                        disabled={deletingId === plan.id}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setDeleteConfirmationId(plan.id);
                                        }}
                                    >
                                        {deletingId === plan.id ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                        ) : (
                                            <Trash2 className="h-5 w-5" />
                                        )}
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {new Date(plan.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm">
                                            <span className="font-medium">Meals:</span>{" "}
                                            {Object.keys(plan.plan_data.plan || {}).length} days
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-medium">Items:</span>{" "}
                                            {Object.keys(plan.plan_data.grocery_list || {}).length} categories
                                        </p>
                                    </div>
                                    <Link href={`/saved-plans/${plan.id}`}>
                                        <Button variant="outline" className="w-full">
                                            View Details
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
            <Footer />

            <Dialog open={!!deleteConfirmationId} onOpenChange={(open) => !open && setDeleteConfirmationId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Meal Plan</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this meal plan? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmationId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

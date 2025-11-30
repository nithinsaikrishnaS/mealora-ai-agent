import { DayCard } from "./DayCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MealPlanTabProps {
    plan: any; // Replace with proper type
}

export function MealPlanTab({ plan }: MealPlanTabProps) {
    if (!plan || !plan.days || !Array.isArray(plan.days)) {
        return (
            <div className="text-center py-20 bg-light/30 rounded-xl border-2 border-dashed border-primary/20">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Valid Plan Data</h3>
                <p className="text-gray-500 mb-6">The plan data seems to be missing or malformed.</p>
                {/* Debug info for dev */}
                <pre className="text-xs text-left bg-gray-100 p-4 rounded mt-4 overflow-auto max-w-md mx-auto">
                    {JSON.stringify(plan, null, 2)}
                </pre>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Weekly Plan</h2>
                <div className="flex gap-2">
                    <Button variant="outline">Export PDF</Button>
                    <Button variant="outline">Save Plan</Button>
                </div>
            </div>

            {plan.days.map((day: any, i: number) => (
                <DayCard key={i} dayPlan={day} index={i} />
            ))}
        </div>
    );
}

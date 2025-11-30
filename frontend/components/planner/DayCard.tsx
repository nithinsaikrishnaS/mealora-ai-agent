import { MealCard } from "./MealCard";
import { motion } from "framer-motion";

interface DayPlan {
    day: number;
    meals: any[]; // Typed properly in real app
}

interface DayCardProps {
    dayPlan: DayPlan;
    index: number;
}

export function DayCard({ dayPlan, index }: DayCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="mb-8"
        >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                    {dayPlan.day}
                </span>
                Day {dayPlan.day}
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
                {dayPlan.meals.map((meal, i) => (
                    <MealCard
                        key={i}
                        meal={meal}
                        type={["Breakfast", "Lunch", "Dinner", "Snack"][i] || "Meal"}
                        onRegenerate={() => console.log("Regenerate", meal.name)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

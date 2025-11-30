import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, ExternalLink, Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { RecipeModal } from "./RecipeModal";
import { Badge } from "@/components/ui/badge";

interface Meal {
    name: string;
    recipe_id?: string;
    description?: string;
    short_description?: string;
    ingredients: string[];
    instructions?: string[];
    tags?: string[];
    nutrition_info?: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    time?: string;
}

interface MealCardProps {
    meal: Meal;
    type: string; // Breakfast, Lunch, Dinner
    onRegenerate: () => void;
}

export function MealCard({ meal, type, onRegenerate }: MealCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Meal>(meal);
    const [isLoading, setIsLoading] = useState(false);

    const handleViewRecipe = async () => {
        setIsModalOpen(true);

        // If we already have instructions, no need to fetch (unless we want to force refresh)
        if (meal.instructions && meal.instructions.length > 0) {
            setSelectedRecipe(meal);
            return;
        }

        // Otherwise, try to fetch enriched data
        if (meal.recipe_id) {
            setIsLoading(true);
            try {
                // Pass the meal name as a query param for better search results
                const url = `/api/recipes/${encodeURIComponent(meal.recipe_id)}?query=${encodeURIComponent(meal.name)}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    // Merge fetched data with existing meal data
                    setSelectedRecipe({
                        ...meal,
                        instructions: data.instructions,
                        ingredients: data.ingredients, // API might have better list
                        nutrition_info: data.nutrition_info || meal.nutrition_info
                    });
                } else {
                    console.warn("Failed to fetch recipe details");
                    // Fallback to existing data
                    setSelectedRecipe(meal);
                }
            } catch (error) {
                console.error("Error fetching recipe:", error);
                setSelectedRecipe(meal);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSelectedRecipe(meal);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="h-full flex flex-col hover:shadow-md transition-shadow group">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div className="text-sm font-medium text-primary uppercase tracking-wide">{type}</div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                    <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary" onClick={onRegenerate}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{meal.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 pb-3">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{meal.short_description || meal.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                            {meal.tags?.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs font-normal">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            {meal.time && (
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {meal.time}
                                </div>
                            )}
                            {meal.nutrition_info && (
                                <div className="flex items-center gap-1">
                                    <Flame className="h-3 w-3 text-orange-500" /> {meal.nutrition_info.calories} kcal
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={handleViewRecipe}
                            data-recipe-id={meal.recipe_id}
                        >
                            View Recipe <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            <RecipeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                meal={selectedRecipe}
            />
        </>
    );
}

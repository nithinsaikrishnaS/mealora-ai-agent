import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock, Flame, Utensils } from "lucide-react";

interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    meal: any; // Replace with proper type
}

export function RecipeModal({ isOpen, onClose, meal }: RecipeModalProps) {
    if (!meal) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <DialogTitle className="text-2xl font-bold font-heading mb-2">{meal.name}</DialogTitle>
                            <DialogDescription className="text-base">{meal.short_description}</DialogDescription>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {meal.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="font-medium">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {meal.nutrition_info && (
                        <div className="flex gap-6 mt-4 text-sm text-gray-600 bg-secondary/10 p-3 rounded-lg w-fit">
                            <div className="flex items-center gap-1.5">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span className="font-bold text-foreground">{meal.nutrition_info.calories}</span> kcal
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground">{meal.nutrition_info.protein}g</span> Protein
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground">{meal.nutrition_info.carbs}g</span> Carbs
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground">{meal.nutrition_info.fat}g</span> Fat
                            </div>
                        </div>
                    )}
                </DialogHeader>

                <Separator />

                <ScrollArea className="flex-1 p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Ingredients */}
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <Utensils className="h-5 w-5 text-primary" /> Ingredients
                            </h3>
                            <ul className="space-y-2">
                                {meal.ingredients?.map((ing: any, i: number) => {
                                    const displayIng = typeof ing === 'string'
                                        ? ing
                                        : `${ing.quantity} ${ing.unit} ${ing.name}`;

                                    return (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                            {displayIng}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Instructions */}
                        <div>
                            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                <Clock className="h-5 w-5 text-primary" /> Instructions
                            </h3>
                            <ol className="space-y-4">
                                {meal.instructions && meal.instructions.length > 0 ? (
                                    meal.instructions.map((step: string, i: number) => (
                                        <li key={i} className="flex gap-3 text-sm text-gray-700">
                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                                                {i + 1}
                                            </span>
                                            <span className="mt-0.5">{step}</span>
                                        </li>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-dashed">
                                        No instructions available for this meal.
                                        <br />
                                        Try regenerating the plan to get full recipe details.
                                    </div>
                                )}
                            </ol>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

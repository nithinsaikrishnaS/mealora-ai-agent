import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBasket, DollarSign, Info, Download, Printer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface GroceryItem {
    name: string;
    quantity: number;
    unit: string;
    estimated_price?: number | null;
}

interface GroceryListTabProps {
    groceryList: Record<string, (GroceryItem | string)[]>;
}

export function GroceryListTab({ groceryList = {} }: GroceryListTabProps) {
    const categories = Object.keys(groceryList).sort();

    const formatPrice = (price?: number | null) => {
        if (price === undefined || price === null) return "—";
        return `₹${price.toFixed(2)}`;
    };

    const formatQuantity = (qty: number, unit: string) => {
        if (!qty) return "—";
        // Simple pluralization
        const displayUnit = (qty > 1 && unit !== 'unit' && !unit.endsWith('s')) ? `${unit}s` : unit;
        return `${qty} ${displayUnit === 'unit' ? '' : displayUnit}`.trim();
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ShoppingBasket className="h-5 w-5 text-primary" />
                    Shopping List
                </h3>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                        Estimated Total: <span className="font-bold text-green-600">
                            ₹{Object.values(groceryList)
                                .flat()
                                .reduce((sum, item) => {
                                    // Handle legacy string items (price 0)
                                    if (typeof item === 'string') return sum;
                                    return sum + (item.estimated_price || 0);
                                }, 0)
                                .toFixed(2)}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" /> CSV
                        </Button>
                        <Button variant="outline" size="sm">
                            <Printer className="h-4 w-4 mr-2" /> Print
                        </Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6">
                    {categories.map((category) => (
                        <div key={category}>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 pl-1">
                                {category}
                            </h4>
                            <div className="grid gap-2">
                                {groceryList[category].map((item, index) => {
                                    // Handle legacy string items
                                    if (typeof item === 'string') {
                                        return (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                                                <div className="flex items-center gap-3">
                                                    <Checkbox id={`${category}-${index}`} />
                                                    <label htmlFor={`${category}-${index}`} className="text-sm font-medium cursor-pointer">
                                                        {item}
                                                    </label>
                                                </div>
                                                <span className="text-xs text-gray-400 italic">Legacy Item</span>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox id={`${category}-${index}`} />
                                                <label
                                                    htmlFor={`${category}-${index}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {item.name}
                                                </label>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1 bg-secondary/20 px-2 py-1 rounded text-xs font-mono">
                                                    {formatQuantity(item.quantity, item.unit)}
                                                </div>

                                                <div className="flex items-center gap-1 w-16 justify-end font-medium text-gray-700">
                                                    {item.estimated_price ? (
                                                        <span className="text-green-600">₹{item.estimated_price.toFixed(2)}</span>
                                                    ) : (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger>
                                                                    <span className="text-gray-300 cursor-help">—</span>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Price not available</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <ShoppingBasket className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No items in the grocery list yet.</p>
                            <p className="text-sm">Generate a meal plan to see ingredients here.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

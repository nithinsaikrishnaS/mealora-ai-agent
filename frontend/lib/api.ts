export interface Preferences {
    days: number;
    meals_per_day: number;
    diet: string;
    allergies: string[];
    cuisine: string[];
    budget: string;
}

const API_URL = "http://localhost:8000/api";

export async function generatePlan(prefs: Preferences) {
    const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(prefs),
    });

    if (!response.ok) {
        throw new Error("Failed to generate plan");
    }

    return response.json();
}

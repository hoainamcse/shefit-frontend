type MealIngredient = {
    id: string;
    name: string;
    image: string;
    created_at: string;
    updated_at: string;
}

type MealPlan = {
    id: string;
    title: string;
    subtitle: string;
    chef_name: string;
    goal: string;
    calories: string;
    image: string;
    description: string;
    number_of_days: number;
    meal_ingredients: MealIngredient[];
}

export type { MealPlan }
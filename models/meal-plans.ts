import { Calorie } from "./calorie";

type MealIngredient = {
    id: string;
    name: string;
    image: string;
    created_at: string;
    updated_at: string;
}

type Goal = 'weight_loss' | 'energy' | 'recovery' | 'hormonal_balance' | 'muscle_tone'

type MealPlan = {
    id: string;
    title: string;
    subtitle: string;
    chef_name: string;
    goal: Goal;
    calories: Calorie;
    image: string;
    description: string;
    number_of_days: number;
    meal_ingredients: MealIngredient[];
    is_public: boolean;
    is_free: boolean;
    free_days: number;
    diet_id: number;
}

export type { MealPlan, Goal }
import { Course } from "./course";
import { MealPlan } from "./meal-plan";
import { Exercise } from "./exercise";
import { Dish } from "./dish";

type FavouriteCourse = {
    id: number;
    user_id: number;
    course_id: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    course: Course;
}

type FavouriteMealPlan = {
    user_id: number;
    meal_plan: MealPlan;
}

type FavouriteExercise = {
    id: number;
    youtube_url: string;
    name: string;
    user_id: number;
    exercise: Exercise;
}

type FavouriteDish = {
    user_id: number;
    dish: Dish;
    id: number;
    image: string;
    title: string;
}

export type { FavouriteCourse, FavouriteMealPlan, FavouriteExercise, FavouriteDish }

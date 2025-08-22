import { MealPlan } from './meal-plan'
import { Exercise } from './exercise'
import { Dish } from './dish'

type FavouriteMealPlan = {
  user_id: number
  meal_plan: MealPlan
}

type FavouriteExercise = {
  id: number
  youtube_url: string
  name: string
  user_id: number
  exercise: Exercise
}

type FavouriteDish = {
  user_id: number
  dish: Dish
  id: number
  image: string
  title: string
}

export type { FavouriteMealPlan, FavouriteExercise, FavouriteDish }

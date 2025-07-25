import type { Calorie } from './calorie'
import type { Diet } from './diet'
import type { Dish } from './dish'
import { Goal } from './goal'

type MealPlanIngredient = {
  name: string
  image: string
}

type MealPlan = {
  id: number
  title: string
  subtitle: string
  chef_name: string
  meal_plan_goal: Goal | null
  cover_image: string
  description: string
  meal_ingredients: MealPlanIngredient[]
  number_of_days: number
  image_mobile: string
  image_desktop: string
  is_public: boolean
  is_free: boolean
  free_days: number
  diet: Diet | null
  calorie: Calorie | null
  description_homepage_1: string
  image_homepage: string
}

type MealPlanGoal = {
  id: string
  name: string
}

type MealPlanPayload = Omit<MealPlan, 'id' | 'diet' | 'calorie' | 'meal_plan_goal' | 'number_of_days'> & {
  diet_id: Diet['id'] | null
  calorie_id: Calorie['id'] | null
  meal_plan_goal_id: Goal['id'] | null
}

type DishMealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'

type MealPlanDay = {
  id: number
  day_number: number
  image: string
}

type MealPlanDayPayload = Omit<MealPlanDay, 'id'>

type MealPlanDish = Omit<Dish, 'diet' | 'image'> & {
  meal_time: DishMealTime
}

type MealPlanDishPayload = Omit<MealPlanDish, 'id' | 'created_at' | 'updated_at'>

export type { MealPlanIngredient, MealPlan, MealPlanGoal, MealPlanPayload }
export type { MealPlanDay, MealPlanDayPayload }
export type { DishMealTime, MealPlanDish, MealPlanDishPayload }

import type { Calorie } from './calorie'
import type { Diet } from './diet'
import type { Dish } from './dish'

type MealPlanGoal = 'weight_loss' | 'energy' | 'recovery' | 'hormonal_balance' | 'muscle_tone'

type MealPlanIngredient = {
  name: string
  image: string
}

type MealPlan = {
  id: number
  title: string
  subtitle: string
  chef_name: string
  goal: MealPlanGoal
  image: string
  description: string
  meal_ingredients: MealPlanIngredient[]
  number_of_days: number // ! not in schema
  is_public: boolean
  is_free: boolean
  free_days: number
  diet: Diet | null
  calorie: Calorie | null
}

type MealPlanPayload = Omit<MealPlan, 'id' | 'diet' | 'calorie' | 'number_of_days'> & {
  diet_id: Diet['id'] | null
  calorie_id: Calorie['id'] | null
}

type DishMealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack'

type MealPlanDay = {
  id: number
  day_number: number
  image: string
}

type MealPlanDish = Omit<Dish, 'diet' | 'image'> & {
  meal_time: DishMealTime
}

type MealPlanDayPayload = Omit<MealPlanDay, 'id'>
type MealPlanDishPayload = Omit<MealPlanDish, 'id' | 'created_at' | 'updated_at'>

export type { MealPlanIngredient, MealPlan, MealPlanGoal, MealPlanPayload }
export type { MealPlanDay, MealPlanDayPayload }
export type { DishMealTime, MealPlanDish, MealPlanDishPayload }

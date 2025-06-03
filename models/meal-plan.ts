import type { Diet } from './diet'
import type { Calorie } from './calorie'

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
  number_of_days: number
  is_public: boolean
  is_free: boolean
  free_days: number
  diet: Diet | null
  calorie: Calorie | null
}

type MealPlanPayload = Omit<MealPlan, 'id' | 'diet' | 'calorie'> & {
  diet_id: Diet['id'] | null
  calorie_id: Calorie['id'] | null
}

export type { MealPlan, MealPlanGoal, MealPlanIngredient, MealPlanPayload }

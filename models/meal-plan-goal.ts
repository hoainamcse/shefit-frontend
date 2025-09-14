type MealPlanGoal = {
  id: number
  name: string
  created_at: string
  updated_at: string
}

type MealPlanGoalPayload = Omit<MealPlanGoal, 'id' | 'created_at' | 'updated_at'>

export type { MealPlanGoal, MealPlanGoalPayload }

type Calorie = {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  // ? Need clarify
  max_calorie: number
}

type CaloriePayload = Omit<Calorie, 'id' | 'created_at' | 'updated_at' | 'max_calorie'>

export type { Calorie, CaloriePayload }

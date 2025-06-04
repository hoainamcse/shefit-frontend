type Calorie = {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

type CaloriePayload = Omit<Calorie, 'id' | 'created_at' | 'updated_at'>

export type { Calorie, CaloriePayload }

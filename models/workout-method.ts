type WorkoutMethod = {
  id: string
  name: string
  created_at: string
  updated_at: string
}

type WorkoutMethodPayload = Omit<WorkoutMethod, 'id' | 'created_at' | 'updated_at'>

export type { WorkoutMethod, WorkoutMethodPayload }

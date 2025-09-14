type MuscleGroup = {
  id: string // expected: number
  name: string
  image: string
  description: string
  created_at: string
  updated_at: string
}

type MuscleGroupPayload = Omit<MuscleGroup, 'id' | 'created_at' | 'updated_at'>

export type { MuscleGroup, MuscleGroupPayload }

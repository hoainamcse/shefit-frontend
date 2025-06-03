type MuscleGroup = {
  id: string
  name: string
  image: string
  created_at: string
  updated_at: string
}

type MuscleGroupPayload = Omit<MuscleGroup, 'id' | 'created_at' | 'updated_at'>

export type { MuscleGroup, MuscleGroupPayload }

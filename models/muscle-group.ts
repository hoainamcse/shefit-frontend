type MuscleGroup = {
  id: string
  name: string
  image: string | null
  created_at: string
  updated_at: string
}

type MuscleGroupPayload = Pick<MuscleGroup, 'name' | 'image'>

export type { MuscleGroup, MuscleGroupPayload }

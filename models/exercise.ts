import { Equipment } from './equipment'
import { MuscleGroup } from './muscle-group'

type Exercise = {
  id: string
  name: string
  description: string
  youtube_url: string
  cover_image: string
  thumbnail_image: string
  muscle_groups: MuscleGroup[]
  equipments: Equipment[]
  created_at: string
  updated_at: string
}

type ExercisePayload = Omit<Exercise, 'id' | 'created_at' | 'updated_at' | 'muscle_groups' | 'equipments'> & {
  muscle_group_ids: MuscleGroup['id'][]
  equipment_ids: Equipment['id'][]
}

export type { Exercise, ExercisePayload }

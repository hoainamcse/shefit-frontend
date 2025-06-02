import { Equipment } from './equipment'
import { MuscleGroup } from './muscle-group'

type Exercise = {
  id: string
  name: string
  description: string | null
  youtube_url: string
  cover_image: string | null
  thumbnail_image: string | null
  muscle_groups: MuscleGroup[]
  equipments: Equipment[]
  created_at: string
  updated_at: string
}

type ExercisePayload = Pick<Exercise, 'name' | 'description' | 'youtube_url' | 'cover_image' | 'thumbnail_image'> & {
  muscle_group_ids: MuscleGroup['id'][]
  equipment_ids: Equipment['id'][]
}

export type { Exercise, ExercisePayload }

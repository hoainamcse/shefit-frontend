import type { MuscleGroup } from '@/models/muscle-group'
import type { Exercise } from '@/models/exercies'
import { fetchData } from '../helpers/fetch-data'
import { ListResponse } from '@/models/response'

export async function getMuscleGroups(): Promise<ListResponse<MuscleGroup>> {
  const response = await fetchData('/v1/muscle-groups/', {
    next: {
      tags: ['muscle-groups'],
    },
  })
  return await response.json()
}

export async function getMuscleGroupExercises(id: string): Promise<ListResponse<Exercise>> {
  const response = await fetchData(`/v1/muscle-groups/${id}/exercises`, {
    next: {
      tags: ['muscle-group-exercises'],
    },
  })
  return await response.json()
}

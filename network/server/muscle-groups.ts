'use server'

import type { Exercise } from '@/models/exercise'
import type { ListResponse } from '@/models/response'
import type { MuscleGroup } from '@/models/muscle-group'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getMuscleGroups(): Promise<ListResponse<MuscleGroup>> {
  const response = await fetchDataServer('/v1/muscle-groups/', {
    next: {
      tags: ['muscle-groups'],
    },
  })
  return await response.json()
}

export async function getMuscleGroupExercises(id: string): Promise<ListResponse<Exercise>> {
  const response = await fetchDataServer(`/v1/muscle-groups/${id}/exercises`, {
    next: {
      tags: ['muscle-group-exercises'],
    },
  })
  return await response.json()
}

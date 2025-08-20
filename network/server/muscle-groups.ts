'use server'

import type { Exercise } from '@/models/exercise'
import type { ApiResponse, ListResponse } from '@/models/response'
import type { MuscleGroup } from '@/models/muscle-group'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getMuscleGroup(id: string): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchDataServer(`/v1/muscle-groups/${id}`)
  return response.json()
}

export async function getMuscleGroupExercises(id: string): Promise<ListResponse<Exercise>> {
  const response = await fetchDataServer(`/v1/muscle-groups/${id}/exercises`)
  return response.json()
}

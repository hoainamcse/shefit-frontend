import type { ApiResponse, ListResponse } from '@/models/response'
import type { Exercise, ExercisePayload } from '@/models/exercise'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyExercises = 'exercises'

export async function getExercises(query?: any): Promise<ListResponse<Exercise>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/exercises' + '?' + searchParams)
  return response.json()
}

export async function createExercise(data: ExercisePayload): Promise<ApiResponse<Exercise>> {
  const response = await fetchData('/v1/exercises', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateExercise(id: Exercise['id'], data: ExercisePayload): Promise<ApiResponse<Exercise>> {
  const response = await fetchData(`/v1/exercises/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteExercise(id: Exercise['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/exercises/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkExercise(ids: Exercise['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/exercises/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}


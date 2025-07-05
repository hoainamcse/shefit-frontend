import { WorkoutMethod, WorkoutMethodPayload } from '@/models/workout-method'
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export const queryKeyWorkoutMethods = 'workout-methods'

export async function getWorkoutMethods(query?: any): Promise<ListResponse<WorkoutMethod>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/workout-methods' + '?' + searchParams)
  return response.json()
}

export async function createWorkoutMethod(data: WorkoutMethodPayload): Promise<ApiResponse<WorkoutMethod>> {
  const response = await fetchData('/v1/workout-methods', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateWorkoutMethod(id: WorkoutMethod['id'], data: WorkoutMethodPayload): Promise<ApiResponse<WorkoutMethod>> {
  const response = await fetchData(`/v1/workout-methods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteWorkoutMethod(id: WorkoutMethod['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/workout-methods/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkWorkoutMethod(ids: WorkoutMethod['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/workout-methods/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}


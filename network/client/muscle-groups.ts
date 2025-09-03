import type { ApiResponse, ListResponse } from '@/models/response'
import type { MuscleGroup, MuscleGroupPayload } from '@/models/muscle-group'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyMuscleGroups = 'muscle-groups'

export async function getMuscleGroups(query?: any): Promise<ListResponse<MuscleGroup>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/muscle-groups' + '?' + searchParams)
  return response.json()
}

export async function getMuscleGroup(id: MuscleGroup['id']): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchData(`/v1/muscle-groups/${id}`)
  return response.json()
}

export async function createMuscleGroup(data: MuscleGroupPayload): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchData('/v1/muscle-groups', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateMuscleGroup(
  id: MuscleGroup['id'],
  data: MuscleGroupPayload
): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchData(`/v1/muscle-groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteMuscleGroup(id: MuscleGroup['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/muscle-groups/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkMuscleGroup(ids: MuscleGroup['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/muscle-groups/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

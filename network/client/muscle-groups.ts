import type { ApiResponse, ListResponse } from '@/models/response'
import type { MuscleGroup, MuscleGroupPayload } from '@/models/muscle-group'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyMuscleGroups = 'muscle-groups'

export async function getMuscleGroups(params?: any): Promise<ListResponse<MuscleGroup>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/muscle-groups' + '?' + queryParams)
  return await response.json()
}

export async function createMuscleGroup(data: MuscleGroupPayload): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchData('/v1/muscle-groups', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateMuscleGroup(
  id: MuscleGroup['id'],
  data: MuscleGroupPayload
): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchData(`/v1/muscle-groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteMuscleGroup(id: MuscleGroup['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/muscle-groups/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

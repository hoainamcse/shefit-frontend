import type { MuscleGroup } from '@/models/muscle-group'
import type { Exercise } from '@/models/exercies'
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

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

export async function getMuscleGroup(id: string): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchData(`/v1/muscle-groups/${id}`, {
    method: 'GET',
  })
  return await response.json()
}

export async function createMuscleGroup(data: any): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchData('/v1/muscle-groups/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}


export async function updateMuscleGroup(id: string, data: any): Promise<ApiResponse<MuscleGroup>> {
  const response = await fetchData(`/v1/muscle-groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteMuscleGroup(id: string): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/muscle-groups/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}



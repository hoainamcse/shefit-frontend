import type { Calorie, CaloriePayload } from '@/models/calorie'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyCalories = 'calories'

export async function getCalories(query?: any): Promise<ListResponse<Calorie>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/calories' + '?' + searchParams)
  return response.json()
}

export async function createCalorie(data: CaloriePayload): Promise<ApiResponse<Calorie>> {
  const response = await fetchData('/v1/calories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateCalorie(id: Calorie['id'], data: CaloriePayload): Promise<ApiResponse<Calorie>> {
  const response = await fetchData(`/v1/calories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteCalorie(id: Calorie['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/calories/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkCalorie(ids: Calorie['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/calories/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}


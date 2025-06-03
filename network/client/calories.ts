import type { ApiResponse, ListResponse } from '@/models/response'
import type { Calorie, CaloriePayload } from '@/models/calorie'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyCalories = 'calories'

export async function getCalories(params?: any): Promise<ListResponse<Calorie>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/calories' + '?' + queryParams)
  return await response.json()
}

export async function createCalorie(data: CaloriePayload): Promise<ApiResponse<Calorie>> {
  const response = await fetchData('/v1/calories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateCalorie(id: Calorie['id'], data: CaloriePayload): Promise<ApiResponse<Calorie>> {
  const response = await fetchData(`/v1/calories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteCalorie(id: Calorie['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/calories/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

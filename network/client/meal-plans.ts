import type { ApiResponse, ListResponse } from '@/models/response'
import type { MealPlan, MealPlanPayload } from '@/models/meal-plan'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyMealPlans = 'meal-plans'

export async function getMealPlans(params?: any): Promise<ListResponse<MealPlan>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/meal-plans' + '?' + queryParams)
  return await response.json()
}

export async function createMealPlan(data: MealPlanPayload): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData('/v1/meal-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function getMealPlan(id: MealPlan['id']): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData(`/v1/meal-plans/${id}`)
  return await response.json()
}

export async function updateMealPlan(id: MealPlan['id'], data: MealPlanPayload): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData(`/v1/meal-plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteMealPlan(id: MealPlan['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal-plans/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

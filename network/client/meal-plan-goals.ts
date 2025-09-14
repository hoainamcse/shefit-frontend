import { MealPlanGoal, MealPlanGoalPayload } from '@/models/meal-plan-goal'
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export const queryKeyMealPlanGoals = 'meal-plan-goals'

export async function getMealPlanGoals(query?: any): Promise<ListResponse<MealPlanGoal>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/meal-plan-goals' + '?' + searchParams)
  return response.json()
}

export async function createMealPlanGoal(data: MealPlanGoalPayload): Promise<ApiResponse<MealPlanGoal>> {
  const res = await fetchData('/v1/meal-plan-goals', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateMealPlanGoal(
  id: MealPlanGoal['id'],
  data: MealPlanGoalPayload
): Promise<ApiResponse<MealPlanGoal>> {
  const res = await fetchData(`/v1/meal-plan-goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteMealPlanGoal(id: MealPlanGoal['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal-plan-goals/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkMealPlanGoal(ids: MealPlanGoal['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/meal-plan-goals/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

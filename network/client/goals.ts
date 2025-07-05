import { Goal, GoalPayload } from '@/models/goal'
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export const queryKeyGoals = 'goals'

export async function getGoals(query?: any): Promise<ListResponse<Goal>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/meal_plan_goals' + '?' + searchParams)
  return response.json()
}

export async function createGoal(data: GoalPayload): Promise<ApiResponse<Goal>> {
  const res = await fetchData('/v1/meal_plan_goals', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateGoal(id: Goal['id'], data: GoalPayload): Promise<ApiResponse<Goal>> {
  const res = await fetchData(`/v1/meal_plan_goals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteGoal(id: Goal['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal_plan_goals/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkGoal(ids: Goal['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/meal_plan_goals/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}


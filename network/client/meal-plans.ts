import type { ApiResponse, ListResponse } from '@/models/response'
import type {
  MealPlan,
  MealPlanDay,
  MealPlanDayPayload,
  MealPlanPayload,
  MealPlanDish,
  MealPlanDishPayload,
} from '@/models/meal-plan'

import { fetchData } from '../helpers/fetch-data'

// Meal Plans API
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

// Meal Plan Days API
export const queryKeyMealPlanDays = 'meal-plan-days'

export async function getMealPlanDays(meal_plan_id: MealPlan['id'], params?: any): Promise<ListResponse<MealPlanDay>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days` + '?' + queryParams)
  return await response.json()
}

export async function createMealPlanDay(
  meal_plan_id: MealPlan['id'],
  data: MealPlanDayPayload
): Promise<ApiResponse<MealPlanDay[]>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days:bulkCreate`, {
    method: 'POST',
    body: JSON.stringify([data]),
  })
  return await response.json()
}

export async function updateMealPlanDay(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id'],
  data: MealPlanDayPayload
): Promise<ApiResponse<MealPlanDay>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteMealPlanDay(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days:bulkDelete`, {
    method: 'DELETE',
    body: JSON.stringify([day_id]),
  })
  return await response.json()
}

// Day Dishes API
export const queryKeyMealPlanDishes = 'meal-plan-dishes'

export async function getMealPlanDishes(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id'],
  params?: any
): Promise<ListResponse<MealPlanDish>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes` + '?' + queryParams)
  return await response.json()
}

export async function createMealPlanDish(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id'],
  data: MealPlanDishPayload
): Promise<ApiResponse<MealPlanDish>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateMealPlanDish(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id'],
  dish_id: MealPlanDish['id'],
  data: MealPlanDishPayload
): Promise<ApiResponse<MealPlanDish>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes/${dish_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteMealPlanDish(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id'],
  dish_id: MealPlanDish['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes/${dish_id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

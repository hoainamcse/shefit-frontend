import type {
  MealPlan,
  MealPlanDay,
  MealPlanDayPayload,
  MealPlanPayload,
  MealPlanDish,
  MealPlanDishPayload,
} from '@/models/meal-plan'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

// Meal Plan APIs
export const queryKeyMealPlans = 'meal-plans'

export async function getMealPlans(query?: any): Promise<ListResponse<MealPlan>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/meal-plans` + searchParams)
  return response.json()
}

export async function createMealPlan(data: MealPlanPayload): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData('/v1/meal-plans', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function getMealPlan(id: MealPlan['id']): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData(`/v1/meal-plans/${id}`)
  return response.json()
}

export async function updateMealPlan(id: MealPlan['id'], data: MealPlanPayload): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData(`/v1/meal-plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteMealPlan(id: MealPlan['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal-plans/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkMealPlan(ids: MealPlan['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/meal-plans/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

export async function duplicateMealPlan(id: MealPlan['id']): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData(`/v1/meal-plans/${id}/duplicate`, {
    method: 'POST',
  })
  return response.json()
}

export async function updateMealPlanDisplayOrder(meal_plan_id: MealPlan['id'], display_order: number): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/update-display-order`, {
    method: 'PUT',
    body: JSON.stringify({ display_order }),
  })
  return response.json()
}

// Meal Plan Day APIs
export const queryKeyMealPlanDays = 'meal-plan-days'

export async function getMealPlanDays(meal_plan_id: MealPlan['id'], query?: any): Promise<ListResponse<MealPlanDay>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days` + '?' + searchParams)
  return response.json()
}

export async function createMealPlanDay(
  meal_plan_id: MealPlan['id'],
  data: MealPlanDayPayload
): Promise<ApiResponse<MealPlanDay[]>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days:bulkCreate`, {
    method: 'POST',
    body: JSON.stringify([data]),
  })
  return response.json()
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
  return response.json()
}

export async function deleteMealPlanDay(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days:bulkDelete`, {
    method: 'DELETE',
    body: JSON.stringify([day_id]),
  })
  return response.json()
}

// Meal Plan Dish APIs
export const queryKeyMealPlanDishes = 'meal-plan-dishes'

export async function getMealPlanDishes(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id'],
  query?: any
): Promise<ListResponse<MealPlanDish>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes` + '?' + searchParams)
  return response.json()
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
  return response.json()
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
  return response.json()
}

export async function deleteMealPlanDish(
  meal_plan_id: MealPlan['id'],
  day_id: MealPlanDay['id'],
  dish_id: MealPlanDish['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes/${dish_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

//Import meal plan
export async function importMealPlanExcel(meal_plan_id: MealPlan['id'], file: File): Promise<ApiResponse<MealPlan>> {
  const formData = new FormData()
  formData.append('file', file, file.name)
  const response = await fetchData(`/v1/meal-plans/import-excel/${meal_plan_id}`, {
    method: 'POST',
    body: formData,
  }, false)
  return await response.json()
}


'use server'

import type { MealPlan } from '@/models/meal-plan'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getMealPlans(query?: any): Promise<ListResponse<MealPlan>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/meal-plans/' + '?' + searchParams)
  return response.json()
}

export async function getMealPlan(meal_plan_id: any): Promise<ApiResponse<MealPlan>> {
  const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}`)
  return response.json()
}

export async function getMealPlanDays(meal_plan_id: string): Promise<ApiResponse<MealPlan>> {
  const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}/days`)
  return response.json()
}

export async function getMealPlanDishes(meal_plan_id: string, day_id: string): Promise<ApiResponse<any>> {
  const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes`)
  return response.json()
}

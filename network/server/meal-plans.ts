'use server'

import type { MealPlan } from '@/models/meal-plan'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getMealPlans(query?: any): Promise<ListResponse<MealPlan>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/meal-plans/?' + searchParams)
  return await response.json()
}

export async function getMealPlanDetails(meal_plan_id: string): Promise<ApiResponse<MealPlan>> {
  const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

export async function getMealPlanByDay(meal_plan_id: string): Promise<ApiResponse<MealPlan>> {
  const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}/days`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

export async function getMealPlanDishes(meal_plan_id: string, day_id: string): Promise<ApiResponse<any>> {
  const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

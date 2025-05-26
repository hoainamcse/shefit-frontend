'use server'

import type { MealPlan } from "@/models/meal-plans"
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'
import { fetchDataServer } from "../helpers/fetch-data-server"
import { revalidateTag } from "next/cache"
import type { Dish } from '../../models/dish'

export async function getMealPlans(query?: any): Promise<ListResponse<MealPlan>> {
    const searchParams = new URLSearchParams(query).toString()
    const response = await fetchData('/v1/meal-plans/?' + searchParams)
    return await response.json()
}

export async function getMealPlanDetails(meal_plan_id: string): Promise<ApiResponse<MealPlan>> {
    const response = await fetchData(`/v1/meal-plans/${meal_plan_id}`, {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}

export async function getMealPlanByDay(meal_plan_id: string): Promise<ApiResponse<MealPlan>> {
    const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days`, {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}

export async function getMealPlanDishes(meal_plan_id: string, day_id: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes`, {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}


export async function createMealPlan(
    // previousState: any,
    data: any
  ): Promise<ApiResponse<MealPlan>> {
    const response = await fetchDataServer('/v1/meal-plans', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    })
    revalidateTag(`meal-plans`)
    return await response.json()
  }


  export async function updateMealPlan(
    meal_plan_id: string,
    data: any
  ): Promise<ApiResponse<MealPlan>> {
    const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'include',
    })
    revalidateTag(`meal-plans`)
    return await response.json()
  }

  export async function deleteMealPlan(meal_plan_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    revalidateTag(`meal-plans`)
    return await response.json()
  }

  export async function createMealPlanDays(
    mealPlanId: number,
    days: any[]
  ): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/meal-plans/${mealPlanId}/days:bulkCreate`, {
      method: 'POST',
      body: JSON.stringify(days),
      credentials: 'include',
    })
    revalidateTag('meal-plans')
    return await response.json()
  }

  export async function updateMealPlanDays(
    mealPlanId: number,
    dayId: number,
    day: any
  ): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/meal-plans/${mealPlanId}/days/${dayId}`, {
      method: 'PUT',
      body: JSON.stringify(day),
      credentials: 'include',
    })
    revalidateTag('meal-plans')
    return await response.json()
  }

  export async function deleteMealPlanDay(
    meal_plan_id: number,
    days: number[]
  ): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}/days:bulkDelete`, {
      method: 'DELETE',
      body: JSON.stringify(days),
      credentials: 'include',
    })
    revalidateTag('meal-plans')
    return await response.json()
  }


  export async function createMealPlanDaysDishes(
    mealPlanId: number,
    dayId: number,
    dish: any
  ): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/meal-plans/${mealPlanId}/days/${dayId}/dishes`, {
      method: 'POST',
      body: JSON.stringify(dish),
      credentials: 'include',
    })
    revalidateTag('meal-plans')
    return await response.json()
  }


  export async function updateMealPlanDish(
    meal_plan_id: string,
    day_id: number,
    dish_id: number,
    dish: any
  ): Promise<ApiResponse<Dish>> {
    const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes/${dish_id}`, {
      method: 'PUT',
      body: JSON.stringify(dish),
      credentials: 'include',
    })
    revalidateTag(`meal-plans`)
    return await response.json()
  }

  export async function deleteMealPlanDish(
    meal_plan_id: number,
    day_id: number,
    dish_id: number,
  ): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes/${dish_id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    revalidateTag(`meal-plans`)
    return await response.json()
  }


  export async function getMealPlanDays(meal_plan_id: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days`, {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}
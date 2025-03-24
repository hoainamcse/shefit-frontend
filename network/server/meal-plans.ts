import type { MealPlan } from "@/models/meal-plans"
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export async function getListMealPlans(): Promise<ListResponse<MealPlan>> {
    const response = await fetchData('/v1/meal-plans/', {
        next: {
            revalidate: 0,
            tags: ['meal-plans'],
        },
    })
    return await response.json()
}

export async function getMealPlanDetails(meal_plan_id: string): Promise<ApiResponse<MealPlan>> {
    const response = await fetchData(`/v1/meal-plans/${meal_plan_id}`, {
        next: {
            revalidate: 0,
            tags: ['meal-plans'],
        },
    })
    return await response.json()
}

export async function getMealPlanByDay(meal_plan_id: string): Promise<ApiResponse<MealPlan>> {
    const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days`, {
        next: {
            revalidate: 0,
            tags: ['meal-plans'],
        },
    })
    return await response.json()
}

export async function getMealPlanDishes(meal_plan_id: string, day_id: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/meal-plans/${meal_plan_id}/days/${day_id}/dishes`, {
        next: {
            revalidate: 0,
            tags: ['meal-plans'],
        },
    })
    return await response.json()
}

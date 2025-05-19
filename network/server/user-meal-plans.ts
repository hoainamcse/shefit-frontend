'use server'
import { ApiResponse, ListResponse } from "@/models/response"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { UserMealPlan } from "@/models/user-meal-plans"
import { revalidateTag } from "next/cache"

export async function getUserMealPlans(userId: string): Promise<ListResponse<UserMealPlan>> {
    const response = await fetchDataServer(`/v1/users/${userId}/meal-plans`,  {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}

export async function createUserMealPlan(data: any, user_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/meal-plans`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`user-meal-plans:${user_id}`)
    return await response.json()
}

export async function deleteUserMealPlan(user_id: string, meal_plan_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/meal-plans/${meal_plan_id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag(`user-meal-plans:${user_id}`)
    return await response.json()
}
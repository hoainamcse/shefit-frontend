import type { ApiResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'
import type { FavouriteMealPlan } from '@/models/favourite'

export const getFavouriteMealPlans = async (user_id: string): Promise<ApiResponse<FavouriteMealPlan[]>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans`, {
        method: 'GET',
    })
    return await response.json()
}

export const addFavouriteMealPlan = async (user_id: string, meal_plan_id: string): Promise<ApiResponse<FavouriteMealPlan>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans`, {
        method: 'POST',
        body: JSON.stringify({ meal_plan_id }),
    })
    return await response.json()
}

export const deleteFavouriteMealPlan = async (user_id: string, meal_plan_id: string): Promise<ApiResponse<any>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans/${meal_plan_id}`, {
        method: 'DELETE',
    })
    return await response.json()
}
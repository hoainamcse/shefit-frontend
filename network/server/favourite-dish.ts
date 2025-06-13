import type { ApiResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'
import type { FavouriteDish } from '@/models/favourite'

export const getFavouriteDishes = async (user_id: string): Promise<ApiResponse<FavouriteDish[]>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/dishes`, {
        method: 'GET',
    })
    return await response.json()
}

export const addFavouriteDish = async (user_id: string, dish_id: string): Promise<ApiResponse<FavouriteDish>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/dishes`, {
        method: 'POST',
        body: JSON.stringify({ dish_id }),
    })
    return await response.json()
}

export const deleteFavouriteDish = async (user_id: string, dish_id: string): Promise<ApiResponse<any>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/dishes/${dish_id}`, {
        method: 'DELETE',
    })
    return await response.json()
}
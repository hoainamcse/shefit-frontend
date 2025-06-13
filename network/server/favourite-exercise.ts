import type { ApiResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'
import type { FavouriteExercise } from '@/models/favourite'

export const getFavouriteExercises = async (user_id: string): Promise<ApiResponse<FavouriteExercise[]>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/exercises`, {
        method: 'GET',
    })
    return await response.json()
}

export const addFavouriteExercise = async (user_id: string, exercise_id: string): Promise<ApiResponse<FavouriteExercise>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/exercises`, {
        method: 'POST',
        body: JSON.stringify({ exercise_id }),
    })
    return await response.json()
}

export const deleteFavouriteExercise = async (user_id: string, exercise_id: string): Promise<ApiResponse<any>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/exercises/${exercise_id}`, {
        method: 'DELETE',
    })
    return await response.json()
}
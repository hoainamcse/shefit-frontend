import type { FavouriteCourse } from '@/models/favourite'
import type { ApiResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'

export const getFavouriteCourses = async (user_id: string): Promise<ApiResponse<FavouriteCourse[]>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/courses`, {
        method: 'GET',
    })
    return await response.json()
}

export const addFavouriteCourse = async (user_id: string, course_id: string): Promise<ApiResponse<FavouriteCourse>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/courses`, {
        method: 'POST',
        body: JSON.stringify({ course_id }),
    })
    return await response.json()
}

export const deleteFavouriteCourse = async (user_id: string, course_id: string): Promise<ApiResponse<any>> => {
    const response = await fetchData(`/v1/users/${user_id}/favourite/courses/${course_id}`, {
        method: 'DELETE',
    })
    return await response.json()
}

'use server'
import { ApiResponse, ListResponse } from "@/models/response"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { UserDish } from "@/models/user-dishes"
import { revalidateTag } from "next/cache"

export async function getUserDishes(userId: string): Promise<ListResponse<UserDish>> {
    const response = await fetchDataServer(`/v1/users/${userId}/dishes`,  {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}

export async function createUserDish(data: any, user_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/dishes`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`user-dishes:${user_id}`)
    return await response.json()
}

export async function deleteUserDish(user_id: string, dish_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/dishes/${dish_id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag(`user-dishes:${user_id}`)
    return await response.json()
}
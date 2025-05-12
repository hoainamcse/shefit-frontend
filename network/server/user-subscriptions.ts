'use server'

import { ApiResponse, ListResponse } from "@/models/response"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { revalidateTag } from "next/cache"
import { UserSubscription } from "@/models/user-subscriptions"

export async function getUserSubscriptions(user_id: string): Promise<ListResponse<UserSubscription>> {
    const response = await fetchDataServer(`/v1/users/{user_id}/subscriptions?id=${user_id}`, {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}

export async function createUserSubscription(data: any, user_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/subscriptions`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`user-subscriptions:${user_id}`)
    return await response.json()
}

export async function updateUserSubscription(user_id: string, subscription_id: string, data: any): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/subscriptions/${subscription_id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`user-subscriptions:${user_id}`)
    return await response.json()
}

export async function deleteUserSubscription(user_id: string, subscription_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/subscriptions/${subscription_id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag(`user-subscriptions:${user_id}`)
    return await response.json()
}

    
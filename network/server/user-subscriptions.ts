'use server'

import { ApiResponse, ListResponse } from "@/models/response"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { revalidateTag } from "next/cache"
import { UserSubscription, UserSubscriptionWithGifts } from "@/models/user-subscriptions"

export async function getUserSubscriptions(user_id: string): Promise<ListResponse<UserSubscriptionWithGifts>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/subscriptions`, {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}

export async function createUserSubscription(data: any, user_id: string): Promise<ApiResponse<UserSubscriptionWithGifts>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/subscriptions`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`user-subscriptions:${user_id}`)
    return await response.json()
}

export async function updateUserSubscription(user_id: string, subscription_id: string, data: any, token: string): Promise<ApiResponse<UserSubscriptionWithGifts>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/subscriptions/${subscription_id}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`user-subscriptions:${user_id}`)
    return await response.json()
}

export async function deleteUserSubscription(user_id: string, subscription_id: string, token: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/subscriptions/${subscription_id}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag(`user-subscriptions:${user_id}`)
    return await response.json()
}

    
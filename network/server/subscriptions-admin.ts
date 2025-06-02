'use server'

import type { Subscription } from "@/models/subscription-admin"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"

export async function getSubscriptions(): Promise<ListResponse<Subscription>> {
    const response = await fetchData("/v1/subscriptions", { next: { tags: ["subscriptions"] } })
    return await response.json()
}

export async function getSubscription(id: number): Promise<ApiResponse<Subscription>> {
    const response = await fetchData(`/v1/subscriptions/${id}`, { next: { tags: ["subscriptions"] } })
    return await response.json()
}

export async function createSubscription(data: any, token: string): Promise<Subscription> {
    const response = await fetchData("/v1/subscriptions", {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`subscriptions`)
    return await response.json()
}

export async function updateSubscription(id: number, data: any, token: string): Promise<Subscription> {
    const response = await fetchData(`/v1/subscriptions/${id}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`subscriptions`)
    return await response.json()
}

export async function deleteSubscription(id: number, token: string): Promise<ApiResponse<Subscription>> {
    const response = await fetchData(`/v1/subscriptions/${id}`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
        credentials: 'include',
    })
    revalidateTag(`subscriptions`)
    return await response.json()
}

export async function updateSubscriptionPrice(id: number, data: any, token: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/subscriptions/${id}/prices`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        method: "PUT",
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`subscriptions`)
    return await response.json()
}



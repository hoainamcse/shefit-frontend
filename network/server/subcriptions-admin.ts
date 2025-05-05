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

export async function createSubscription(data: any): Promise<Subscription> {
    const response = await fetchData("/v1/subscriptions", {
        method: "POST",
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`subscriptions`)
    return await response.json()
}

export async function updateSubscription(id: number, data: any): Promise<Subscription> {
    const response = await fetchData(`/v1/subscriptions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`subscriptions`)
    return await response.json()
}

export async function deleteSubscription(id: number): Promise<ApiResponse<Subscription>> {
    const response = await fetchData(`/v1/subscriptions/${id}`, {
        method: "DELETE",
        credentials: 'include',
    })
    revalidateTag(`subscriptions`)
    return await response.json()
}


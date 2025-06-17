'use server'


import { fetchDataServer } from "../helpers/fetch-data-server"
import { ApiResponse, ListResponse } from "@/models/response"
import { Subscription } from "@/models/subscription"
import { revalidateTag } from "next/cache"

export async function getSubscriptions(query?: any): Promise<ListResponse<Subscription>> {
    const searchParams = new URLSearchParams(query).toString()
    const response = await fetchDataServer("/v1/subscriptions/?" + searchParams, { next: { tags: ["subscriptions"] } })
    return await response.json()
}

export async function getSubscription(id: number): Promise<ApiResponse<Subscription>> {
    const response = await fetchDataServer(`/v1/subscriptions/${id}`, { next: { tags: ["subscriptions"] } })
    return await response.json()
}

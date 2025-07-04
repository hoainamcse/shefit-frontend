'use server'

import { fetchDataServer } from "../helpers/fetch-data-server"
import { ApiResponse, ListResponse } from "@/models/response"
import { Subscription } from "@/models/subscription"
import { revalidateTag } from "next/cache"
import { fetchData } from "../helpers/fetch-data"

export async function getSubscriptions(query?: any): Promise<ListResponse<Subscription>> {
    const searchParams = new URLSearchParams(query).toString()
    const response = await fetchDataServer("/v1/subscriptions/?" + searchParams, { next: { tags: ["subscriptions"] } })
    return await response.json()
}

export async function getSubscription(id: any, params?: any): Promise<ApiResponse<Subscription>> {
    const queryParams = new URLSearchParams(params).toString()
    const response = await fetchData(`/v1/subscriptions/${id}?${queryParams}`)
    return await response.json()
}

export async function getSubscriptionsByCourseId(courseId: number): Promise<ListResponse<Subscription>> {
    const response = await fetchDataServer(`/v1/subscriptions/?course_id=${courseId}`, { next: { tags: ["subscriptions"] } })
    return await response.json()
}


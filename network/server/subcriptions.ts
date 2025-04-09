import type { Subscription } from "@/models/subscriptions"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "@/models/response"

export async function getSubscriptions(): Promise<ListResponse<Subscription>> {
    const response = await fetchData("/v1/subscriptions", { next: { tags: ["subscriptions"] } })
    return await response.json()
}

export async function getSubscription(id: number): Promise<Subscription> {
    const response = await fetchData(`/v1/subscriptions/${id}`, { next: { tags: ["subscriptions"] } })
    return await response.json()
}


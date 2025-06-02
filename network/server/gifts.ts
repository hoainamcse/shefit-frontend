'use server'

import type { Gift } from "@/models/subscription-admin"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"

export async function createGift(data: any, accessToken: string, bulk: boolean = false): Promise<ApiResponse<Gift>> {
    const response = await fetchData(`/v1/gifts?bulk=${bulk}`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          }, 
    })
    revalidateTag(`gifts`)
    return await response.json()
}

export async function updateGift(gift_id: string, data: any): Promise<ApiResponse<Gift>> {
    const response = await fetchData(`/v1/gifts/${gift_id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`gifts`)
    return await response.json()
}


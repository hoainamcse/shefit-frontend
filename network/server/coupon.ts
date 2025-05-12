'use server'

import { Coupon } from "@/models/coupon"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"


export async function getListCoupons() : Promise<ListResponse<Coupon>> {
    const response = await fetchDataServer('/v1/coupons', {
        method: 'GET',
        credentials: 'include',
    })
    revalidateTag(`coupons`)
    return await response.json()
}

export async function createCoupon(data: any): Promise<ApiResponse<Coupon>> {
    const response = await fetchDataServer('/v1/coupons', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`coupons`)
    return await response.json()
}

export async function deleteCoupon(coupon_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/coupons/${coupon_id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag(`coupons`)
    return await response.json()
}

export async function updateCoupon(data: any, coupon_id: string): Promise<ApiResponse<Coupon>> {
    const response = await fetchDataServer(`/v1/coupons/${coupon_id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`coupons`)
    return await response.json()
}
    

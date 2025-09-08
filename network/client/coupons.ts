import type { ApiResponse, ListResponse } from '@/models/response'
import type { Coupon } from '@/models/coupon'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyCoupons = 'coupons'

export async function getCoupons(query?: any): Promise<ListResponse<Coupon>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData('/v1/coupons' + searchParams)
  return response.json()
}

export async function createCoupon(data: any): Promise<ApiResponse<Coupon>> {
  const response = await fetchData('/v1/coupons', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateCoupon(data: any, couponId: string): Promise<ApiResponse<Coupon>> {
  const response = await fetchData(`/v1/coupons/${couponId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteCoupon(id: number): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/coupons/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkCoupon(ids: number[]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/coupons/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

export async function checkCoupon(code: string, query?: any): Promise<ApiResponse<Coupon>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/coupons/check/${code}` + searchParams)
  return response.json()
}

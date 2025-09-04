'use server'

import type { Coupon } from '@/models/coupon'
import type { ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCoupons(query?: any): Promise<ListResponse<Coupon>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchDataServer('/v1/coupons' + searchParams)
  return response.json()
}

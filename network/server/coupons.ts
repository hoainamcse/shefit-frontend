'use server'

import type { Coupon } from '@/models/coupon'
import type { ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCoupons(): Promise<ListResponse<Coupon>> {
  const response = await fetchDataServer('/v1/coupons/')
  return response.json()
}

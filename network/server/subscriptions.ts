'use server'

import type { ApiResponse } from '@/models/response'
import type { Subscription } from '@/models/subscription'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getSubscription(id: any, query?: any): Promise<ApiResponse<Subscription>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer(`/v1/subscriptions/${id}` + '?' + searchParams)
  return response.json()
}

import type { ApiResponse, ListResponse } from '@/models/response'
import type { Subscription, Gift, GiftPayload, SubscriptionPayload } from '@/models/subscription'
import type { User } from '@/models/user'

import { fetchData } from '../helpers/fetch-data'

export const queryKeySubscriptions = 'subscriptions'

export async function getSubscriptions(query?: any): Promise<ListResponse<Subscription>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/subscriptions' + '?' + searchParams)
  return response.json()
}

export async function createSubscription(
  data: any // expected: SubscriptionPayload
): Promise<ApiResponse<Subscription>> {
  const response = await fetchData('/v1/subscriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function getSubscription(id: Subscription['id']): Promise<ApiResponse<Subscription>> {
  const response = await fetchData(`/v1/subscriptions/${id}` + '?include_relationships=true')
  return response.json()
}

export async function updateSubscription(
  id: Subscription['id'],
  data: any // expected: SubscriptionPayload
): Promise<ApiResponse<Subscription>> {
  const response = await fetchData(`/v1/subscriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteSubscription(id: Subscription['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/subscriptions/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkSubscription(ids: Subscription['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/subscriptions/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

export async function updateSubscriptionPrices(id: Subscription['id'], data: any): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/subscriptions/${id}/prices`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function duplicateSubscription(id: Subscription['id']): Promise<ApiResponse<Subscription>> {
  const response = await fetchData(`/v1/subscriptions/${id}/duplicate`, {
    method: 'POST',
  })
  return response.json()
}

export async function updateSubscriptionDisplayOrder(id: Subscription['id'], display_order: number): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/subscriptions/${id}/update-display-order`, {
    method: 'PUT',
    body: JSON.stringify({ display_order }),
  })
  return response.json()
}

// Subscription Gift APIs
export const queryKeySubscriptionGifts = 'subscription-gifts'

export async function createGift(data: GiftPayload): Promise<ApiResponse<Gift>> {
  const response = await fetchData(`/v1/gifts`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateGift(id: Gift['id'], data: GiftPayload): Promise<ApiResponse<Gift>> {
  const response = await fetchData(`/v1/gifts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteGift(id: Gift['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/gifts/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// Sub Admin specific subscriptions
export async function getSubAdminSubscriptions(query?: any): Promise<ListResponse<Subscription>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/sub_admin/subscriptions' + '?' + searchParams)
  return response.json()
}

export async function getUsersBySubAdmin(query?: any): Promise<ListResponse<User>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/sub_admin/user-subscriptions${searchParams}`)
  return response.json()
}

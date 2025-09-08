'use server'

import type { User } from '@/models/user'
import type { ApiResponse, ListResponse } from '@/models/response'
import type { UserSubscription } from '@/models/user-subscriptions'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getUser(id: User['id']): Promise<ApiResponse<User>> {
  const response = await fetchDataServer(`/v1/users/${id}`)
  return response.json()
}

export async function getUserSubscriptions(id: User['id'], query?: any): Promise<ListResponse<UserSubscription>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchDataServer(`/v1/users/${id}/subscriptions${searchParams}`)
  return response.json()
}

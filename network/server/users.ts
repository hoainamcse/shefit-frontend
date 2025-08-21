'use server'

import type { User } from '@/models/user'
import type { ApiResponse, ListResponse } from '@/models/response'
import type { UserSubscriptionDetail } from '@/models/user-subscriptions'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getUser(id: User['id']): Promise<ApiResponse<User>> {
  const response = await fetchDataServer(`/v1/users/${id}`)
  return response.json()
}

export async function getUserSubscriptions(id: User['id']): Promise<ListResponse<UserSubscriptionDetail>> {
  const response = await fetchDataServer(`/v1/users/${id}/subscriptions`)
  return response.json()
}

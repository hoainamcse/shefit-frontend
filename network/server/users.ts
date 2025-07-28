'use server'

import type { User } from '@/models/user'
import type { ApiResponse, ListResponse } from '@/models/response'
import type { UserSubscriptionDetail } from '@/models/user-subscriptions'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getUser(user_id: string): Promise<ApiResponse<User>> {
  const response = await fetchDataServer(`/v1/users/${user_id}`)
  return response.json()
}

export async function getUserSubscriptions(user_id: string): Promise<ListResponse<UserSubscriptionDetail>> {
  const response = await fetchDataServer(`/v1/users/${user_id}/subscriptions`)
  return response.json()
}

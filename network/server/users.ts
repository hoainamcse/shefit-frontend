'use server'

import type { User } from '@/models/user'
import type { ApiResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getUser(user_id: string): Promise<ApiResponse<User>> {
  const response = await fetchDataServer(`/v1/users/${user_id}`)
  return response.json()
}

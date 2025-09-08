import type { User } from '@/models/user'
import type { ApiResponse, ListResponse } from '@/models/response'
import type { UserCart } from '@/models/user-cart'
import type { UserCourse } from '@/models/user-courses'
import type { Subscription } from '@/models/subscription'
import type { UserSubscription, UserSubscriptionPayload } from '@/models/user-subscriptions'

import { fetchData } from '../helpers/fetch-data'

// Body Quiz APIs
export const queryKeyUsers = 'users'

export async function getUsers(query?: any): Promise<ListResponse<User>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/users${searchParams}`)
  return response.json()
}

export async function getUser(id: User['id']): Promise<ApiResponse<User>> {
  const response = await fetchData(`/v1/users/${id}`, {
    method: 'GET',
  })
  return response.json()
}

export async function updateUser(id: User['id'], data: any): Promise<ApiResponse<User>> {
  const response = await fetchData(`/v1/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteUser(id: User['id']): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/users/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkUser(ids: User['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/users/bulk`, {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

export async function updatePassword(data: any): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/auth:changePassword`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function importUsersExcel(file: File): Promise<ApiResponse<any>> {
  const formData = new FormData()
  formData.append('file', file, file.name)
  const response = await fetchData(
    '/v1/users/import-excel',
    {
      method: 'POST',
      body: formData,
    },
    false
  )
  return await response.json()
}

// User Cart
export async function getUserCarts(id: User['id']): Promise<ListResponse<UserCart>> {
  const response = await fetchData(`/v1/users/${id}/carts`)
  return response.json()
}

export async function createUserCart(userID: User['id'], cartID: number): Promise<UserCart> {
  const response = await fetchData(`/v1/users/${userID}/carts`, {
    method: 'POST',
    body: JSON.stringify({
      user_id: userID,
      cart_id: cartID,
    }),
  })
  return response.json()
}

// User Course
export async function getUserCourses(id: User['id']): Promise<ListResponse<UserCourse>> {
  const response = await fetchData(`/v1/users/${id}/courses`)
  return response.json()
}

export async function createUserCourse(data: any, id: User['id']): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/users/${id}/courses`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

// User Subscription
export async function getUserSubscriptions(id: User['id'], query?: any): Promise<ListResponse<UserSubscription>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/users/${id}/subscriptions${searchParams}`)
  return response.json()
}

export async function createUserSubscription(
  userId: User['id'],
  data: UserSubscriptionPayload
): Promise<ApiResponse<UserSubscription>> {
  const response = await fetchData(`/v1/users/${userId}/subscriptions`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateUserSubscription(
  userId: User['id'],
  subscriptionId: Subscription['id'],
  data: UserSubscriptionPayload
): Promise<ApiResponse<UserSubscription>> {
  const response = await fetchData(`/v1/users/${userId}/subscriptions/${subscriptionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteUserSubscription(userID: User['id'], subscriptionID: string): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/users/${userID}/subscriptions/${subscriptionID}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function checkUserSavedResource(
  userID: User['id'],
  resourceType: string,
  resourceID: number
): Promise<
  ApiResponse<{
    in_favourite: boolean
    user_subscription_ids: number[]
  }>
> {
  const response = await fetchData(
    `/v1/users/${userID}/resources/saved?resource_type=${resourceType}&resource_id=${resourceID}`,
    {
      method: 'GET',
    }
  )
  return response.json()
}

export async function checkUserAccessedResource(
  userID: User['id'],
  resourceType: string,
  resourceID: number
): Promise<ApiResponse<boolean>> {
  const response = await fetchData(
    `/v1/users/${userID}/resources/accessed?resource_type=${resourceType}&resource_id=${resourceID}`,
    {
      method: 'GET',
    }
  )
  return response.json()
}

export async function addUserSavedResource(
  userID: User['id'],
  resourceType: string,
  resourceID: number
): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/users/${userID}/resources/saved`, {
    method: 'POST',
    body: JSON.stringify({
      resource_type: resourceType,
      resource_id: resourceID,
    }),
  })
  return response.json()
}

import type { User } from '@/models/user'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'
import { UserCart } from '@/models/user-cart'
import { UserCourse } from '@/models/user-courses'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'

// Body Quiz APIs
export const queryKeyUsers = 'users'
export const queryKeyUserSubscriptions = 'user-subscriptions'

export async function getUsers(query?: any): Promise<ListResponse<User>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData(`/v1/users` + '?' + searchParams)
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
export async function getUserSubscriptions(id: User['id']): Promise<ListResponse<UserSubscriptionDetail>> {
  const response = await fetchData(`/v1/users/${id}/subscriptions`)
  return response.json()
}

export async function createUserSubscription(data: any, id: User['id']): Promise<ApiResponse<UserSubscriptionDetail>> {
  const response = await fetchData(`/v1/users/${id}/subscriptions`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateUserSubscription(
  userID: User['id'],
  subscriptionID: string,
  data: any
): Promise<ApiResponse<UserSubscriptionDetail>> {
  const response = await fetchData(`/v1/users/${userID}/subscriptions/${subscriptionID}`, {
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

import type { User } from '@/models/user'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'
import { UserCart } from '@/models/user-cart'
import { UserCourse } from '@/models/user-courses'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'

export async function getUsers(): Promise<ListResponse<User>> {
  const response = await fetchData(`/v1/users`)
  return response.json()
}

export async function getUser(user_id: string): Promise<ApiResponse<User>> {
  const response = await fetchData(`/v1/users/${user_id}`, {
    method: 'GET',
  })
  return response.json()
}

export async function updateUser(user_id: string, data: any): Promise<ApiResponse<User>> {
  const response = await fetchData(`/v1/users/${user_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteUser(user_id: string): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/users/${user_id}`, {
    method: 'DELETE',
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
export async function getUserCart(userId: number): Promise<ListResponse<UserCart>> {
  const response = await fetchData(`/v1/users/${userId}/carts`)
  return response.json()
}

export async function createUserCart(userId: number, cartId: number): Promise<UserCart> {
  const response = await fetchData(`/v1/users/${userId}/carts`, {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      cart_id: cartId,
    }),
  })
  return response.json()
}

// User Course
export async function getUserCourses(userId: string): Promise<ListResponse<UserCourse>> {
  const response = await fetchData(`/v1/users/${userId}/courses`)
  return response.json()
}

export async function createUserCourse(data: any, user_id: string): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/users/${user_id}/courses`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

// User Subscription
export async function getUserSubscriptions(user_id: string): Promise<ListResponse<UserSubscriptionDetail>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions`)
  return response.json()
}

export async function createUserSubscription(data: any, user_id: string): Promise<ApiResponse<UserSubscriptionDetail>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateUserSubscription(
  user_id: string,
  subscription_id: string,
  data: any
): Promise<ApiResponse<UserSubscriptionDetail>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteUserSubscription(user_id: string, subscription_id: string): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

import type { User } from '@/models/user'
import type { Dish } from '@/models/dish'
import type { Course } from '@/models/course'
import type { Exercise } from '@/models/exercise'
import type { MealPlan } from '@/models/meal-plan'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'
import { Subscription } from '@/models/subscription'

export const queryKeyUserSubscriptions = 'user-subscriptions'

// UserSubscription Dish
export async function getUserSubscriptionDishes(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  query?: any
): Promise<ListResponse<Dish>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/dishes${searchParams}`)
  return response.json()
}

export async function addUserSubscriptionDish(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  dish_id: Dish['id']
): Promise<ApiResponse<Dish>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/dishes`, {
    method: 'POST',
    body: JSON.stringify({ dish_id }),
  })
  return response.json()
}

export async function removeUserSubscriptionDish(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  dish_id: Dish['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/dishes/${dish_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// UserSubscription Meal Plan
export async function getUserSubscriptionMealPlans(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  query?: any
): Promise<ListResponse<MealPlan>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/meal-plans${searchParams}`)
  return response.json()
}

export async function addUserSubscriptionMealPlan(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  meal_plan_id: MealPlan['id']
): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/meal-plans`, {
    method: 'POST',
    body: JSON.stringify({ meal_plan_id }),
  })
  return response.json()
}

export async function removeUserSubscriptionMealPlan(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  meal_plan_id: MealPlan['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/meal-plans/${meal_plan_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// UserSubscription Exercise
export async function getUserSubscriptionExercises(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  query?: any
): Promise<ListResponse<Exercise>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/exercises${searchParams}`)
  return response.json()
}

export async function addUserSubscriptionExercise(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  exercise_id: Exercise['id']
): Promise<ApiResponse<Exercise>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/exercises`, {
    method: 'POST',
    body: JSON.stringify({ exercise_id }),
  })
  return response.json()
}

export async function removeUserSubscriptionExercise(
  user_id: User['id'],
  subscription_id: Subscription['id'],
  exercise_id: Exercise['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/users/${user_id}/subscriptions/${subscription_id}/exercises/${exercise_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

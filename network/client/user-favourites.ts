import type { ApiResponse, ListResponse } from '@/models/response'
import type { FavouriteCourse, FavouriteDish, FavouriteExercise, FavouriteMealPlan } from '@/models/favourite'

import { fetchData } from '../helpers/fetch-data'

// Favourite Course
export async function getFavouriteCourses(user_id: string): Promise<ListResponse<FavouriteCourse>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/courses`)
  return response.json()
}

export async function addFavouriteCourse(user_id: string, course_id: string): Promise<ApiResponse<FavouriteCourse>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/courses`, {
    method: 'POST',
    body: JSON.stringify({ course_id }),
  })
  return response.json()
}

// Favourite Dish
export async function getFavouriteDishes(user_id: string): Promise<ListResponse<FavouriteDish>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/dishes`)
  return response.json()
}

export async function addFavouriteDish(user_id: string, dish_id: string): Promise<ApiResponse<FavouriteDish>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/dishes`, {
    method: 'POST',
    body: JSON.stringify({ dish_id }),
  })
  return response.json()
}

// Favourite Meal Plan
export async function getFavouriteMealPlans(user_id: string): Promise<ListResponse<FavouriteMealPlan>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans`)
  return response.json()
}

export async function addFavouriteMealPlan(
  user_id: string,
  meal_plan_id: string
): Promise<ApiResponse<FavouriteMealPlan>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans`, {
    method: 'POST',
    body: JSON.stringify({ meal_plan_id }),
  })
  return response.json()
}

// Favourite Exercise
export async function getFavouriteExercises(user_id: string): Promise<ListResponse<FavouriteExercise>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/exercises`)
  return response.json()
}

export async function addFavouriteExercise(
  user_id: string,
  exercise_id: string
): Promise<ApiResponse<FavouriteExercise>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/exercises`, {
    method: 'POST',
    body: JSON.stringify({ exercise_id }),
  })
  return response.json()
}

export async function deleteFavouriteMealPlan(user_id: string, meal_plan_id: string): Promise<ApiResponse<void>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans/${meal_plan_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteFavouriteExercise(user_id: string, exercise_id: string): Promise<ApiResponse<void>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/exercises/${exercise_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteFavouriteDish(user_id: string, dish_id: string): Promise<ApiResponse<void>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/dishes/${dish_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteFavouriteCourse(user_id: string, course_id: string): Promise<ApiResponse<void>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/courses/${course_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

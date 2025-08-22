import type { User } from '@/models/user'
import type { Dish } from '@/models/dish'
import type { Course } from '@/models/course'
import type { Exercise } from '@/models/exercise'
import type { MealPlan } from '@/models/meal-plan'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

// Favourite Course
export async function getFavouriteCourses(user_id: User['id']): Promise<ListResponse<Course>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/courses`)
  return response.json()
}

export async function addFavouriteCourse(user_id: User['id'], course_id: Course['id']): Promise<ApiResponse<Course>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/courses`, {
    method: 'POST',
    body: JSON.stringify({ course_id }),
  })
  return response.json()
}

export async function removeFavouriteCourse(
  user_id: User['id'],
  course_id: Course['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/courses/${course_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// Favourite Dish
export async function getFavouriteDishes(user_id: User['id']): Promise<ListResponse<Dish>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/dishes`)
  return response.json()
}

export async function addFavouriteDish(user_id: User['id'], dish_id: Dish['id']): Promise<ApiResponse<Dish>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/dishes`, {
    method: 'POST',
    body: JSON.stringify({ dish_id }),
  })
  return response.json()
}

export async function removeFavouriteDish(user_id: User['id'], dish_id: Dish['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/dishes/${dish_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// Favourite Meal Plan
export async function getFavouriteMealPlans(user_id: User['id']): Promise<ListResponse<MealPlan>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans`)
  return response.json()
}

export async function addFavouriteMealPlan(
  user_id: User['id'],
  meal_plan_id: MealPlan['id']
): Promise<ApiResponse<MealPlan>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans`, {
    method: 'POST',
    body: JSON.stringify({ meal_plan_id }),
  })
  return response.json()
}

export async function removeFavouriteMealPlan(
  user_id: User['id'],
  meal_plan_id: MealPlan['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/meal-plans/${meal_plan_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// Favourite Exercise
export async function getFavouriteExercises(user_id: User['id']): Promise<ListResponse<Exercise>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/exercises`)
  return response.json()
}

export async function addFavouriteExercise(
  user_id: User['id'],
  exercise_id: Exercise['id']
): Promise<ApiResponse<Exercise>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/exercises`, {
    method: 'POST',
    body: JSON.stringify({ exercise_id }),
  })
  return response.json()
}

export async function removeFavouriteExercise(
  user_id: User['id'],
  exercise_id: Exercise['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/users/${user_id}/favourite/exercises/${exercise_id}`, {
    method: 'DELETE',
  })
  return response.json()
}

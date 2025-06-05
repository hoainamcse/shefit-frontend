import type { Course, CoursePayload } from '@/models/course'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyCourses = 'courses'

export async function getCourses(params?: any): Promise<ListResponse<Course>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/courses/' + '?' + queryParams)
  return await response.json()
}

export async function createCourse(data: CoursePayload): Promise<ApiResponse<Course>> {
  const response = await fetchData('/v1/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function getCourse(id: Course['id']): Promise<ApiResponse<Course>> {
  const response = await fetchData(`/v1/courses/${id}`)
  return await response.json()
}

export async function updateCourse(id: Course['id'], data: CoursePayload): Promise<ApiResponse<Course>> {
  const response = await fetchData(`/v1/courses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteCourse(id: Course['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/courses/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

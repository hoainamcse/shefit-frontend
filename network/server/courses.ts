'use server'

import type { Course } from '@/models/course'
import type { ApiResponse, ListResponse } from '@/models/response'
import { fetchDataServer } from '@/network/helpers/fetch-data-server'

export async function getCourses(): Promise<ListResponse<Course>> {
  const response = await fetchDataServer('/v1/courses/', {
    next: {
      revalidate: 0,
      tags: ['courses'],
    },
  })
  return await response.json()
}

export async function getCourse(course_id: string): Promise<ApiResponse<Course>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

export async function createCourse(
  // previousState,
  data: Omit<Course, 'id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Course>> {
  const response = await fetchDataServer('/v1/courses/', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  })
  console.log('Response: ', 'abc')
  return await response.json()
}

import type { Course } from '@/models/course'
import { fetchDataServer } from '../helpers/fetch-data-server'
import { ApiResponse, ListResponse } from '@/models/response'

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

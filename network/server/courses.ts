'use server'

import type { Course, LiveDay, CourseWeek, DayCircuit, WeekDay } from '@/models/course'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCourses(query?: any): Promise<ListResponse<Course>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/courses/' + '?' + searchParams)
  return response.json()
}

export async function getCourse(course_id: Course['id']): Promise<ApiResponse<Course>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}?include_relationships=true`)
  return response.json()
}

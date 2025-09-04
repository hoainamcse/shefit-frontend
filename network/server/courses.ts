'use server'

import type { Course, CourseWeek, DayCircuit, WeekDay } from '@/models/course'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCourses(query?: any): Promise<ListResponse<Course>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchDataServer('/v1/courses' + searchParams)
  return response.json()
}

export async function getCourse(course_id: Course['id']): Promise<ApiResponse<Course>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}?include_relationships=true`)
  return response.json()
}

export async function getCourseWeeks(course_id: Course['id'], query?: any): Promise<ListResponse<CourseWeek>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchDataServer(`/v1/courses/${course_id}/video-classes/weeks` + searchParams)
  return response.json()
}

export async function getWeekDays(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  query?: any
): Promise<ListResponse<WeekDay>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer(
    `/v1/courses/${course_id}/video-classes/weeks/${week_id}/days` + '?' + searchParams
  )
  return response.json()
}

export async function getDayCircuits(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  day_id: WeekDay['id'],
  query?: any
): Promise<ListResponse<DayCircuit>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer(
    `/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits` + '?' + searchParams
  )
  return response.json()
}

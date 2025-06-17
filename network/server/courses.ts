'use server'

import type { Course, LiveDay, CourseWeek, DayCircuit, WeekDay } from '@/models/course'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCourses(query?: any): Promise<ListResponse<Course>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/courses/?' + searchParams)
  return await response.json()
}

export async function getCoursesByType(format: 'video' | 'live'): Promise<ListResponse<Course>> {
  const response = await fetchDataServer(`/v1/courses/?course_format=${format}`, {
    next: {
      revalidate: 0,
      tags: [`courses:${format}`],
    },
  })
  return await response.json()
}

export async function getCourse(course_id: Course['id']): Promise<ApiResponse<Course>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}?include_relationships=true`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

export async function getLiveDays(courseId: Course['id']): Promise<ListResponse<LiveDay>> {
  const response = await fetchDataServer(`/v1/courses/${courseId}/live-classes/`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

export async function getWeeks(course_id: Course['id']): Promise<ListResponse<CourseWeek>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}/video-classes/weeks/`, { next: { tags: ['weeks'] } })
  return response.json()
}

export async function getDays(course_id: Course['id'], week_id: CourseWeek['id']): Promise<ListResponse<WeekDay>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days`, {
    next: { tags: ['days'] },
  })
  return response.json()
}

export async function getCircuits(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  day_id: WeekDay['id']
): Promise<ListResponse<DayCircuit>> {
  const response = await fetchDataServer(
    `/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits`,
    {
      next: { tags: ['circuits'] },
    }
  )
  return response.json()
}

'use server'

import type { Course, CourseLive } from '@/models/course'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCourses(query?: any): Promise<ListResponse<Course>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/courses/?' + searchParams)
  return await response.json()
}

export async function getCoursesByType(format: 'video' | 'live'): Promise<ListResponse<Course>> {
  const response = await fetchDataServer(`/v1/courses/?course_format=${format}`, {
    cache: 'force-cache',
    next: {
      revalidate: false,
      tags: [`courses:${format}`],
    },
  })
  return await response.json()
}

export async function getCourse(course_id: Course['id']): Promise<ApiResponse<Course>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

export async function getCoursesBySubscriptionId(subscription_id: string): Promise<ListResponse<Course>> {
  const response = await fetchDataServer(`/v1/courses/?subscription_id=${subscription_id}`, {
    cache: 'force-cache',
    next: {
      revalidate: false,
      tags: [`courses:subscription_id=${subscription_id}`],
    },
  })
  return await response.json()
}

export async function getCourseLives(courseId: Course['id']): Promise<ListResponse<CourseLive>> {
  const response = await fetchDataServer(`/v1/courses/${courseId}/live-classes/`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

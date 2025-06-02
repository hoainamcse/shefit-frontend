'use server'

import { revalidateTag } from 'next/cache'

import type { DetailCourse, ListCourse } from '@/models/course-admin'
import type { ApiResponse, ListResponse } from '@/models/response'
import { fetchDataServer } from '@/network/helpers/fetch-data-server'

export async function getCourses(
  format?: 'video' | 'live',
  isOneOnOne?: boolean
): Promise<ListResponse<ListCourse>> {
  // Build query parameters dynamically
  const params = new URLSearchParams()
  if (format) params.append('course_format', format)
  if (isOneOnOne !== undefined) params.append('is_one_on_one', String(isOneOnOne))
  const query = params.toString()
  const url = `/v1/courses/${query ? `?${query}` : ''}`

  const response = await fetchDataServer(url, {
    next: {
      revalidate: 0,
      tags: [format ? `courses:${format}` : 'courses'],
    },
  })
  return await response.json()
}

export async function getCourse(course_id: string): Promise<ApiResponse<DetailCourse>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}`, {
    next: {
      revalidate: 0,
    },
  })
  return await response.json()
}

export async function createCourse(
  // previousState: any,
  data: any,
  token: string
): Promise<ApiResponse<DetailCourse>> {
  const response = await fetchDataServer('/v1/courses', {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
  },
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  })
  revalidateTag(`courses:${data.course_format}`)
  return await response.json()
}

export async function getCoursesBySubscriptionId(subscription_id: string): Promise<ListResponse<ListCourse>> {
  const response = await fetchDataServer(`/v1/courses/?subscription_id=${subscription_id}`, {
    next: {
      tags: [`courses:subscription_id=${subscription_id}`],
    },
  })
  return await response.json()
}

export async function updateCourse(course_id: string, data: any, token: string): Promise<ApiResponse<DetailCourse>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
  })
  revalidateTag(`courses:${data.course_format}`)
  return await response.json()
}

export async function deleteCourse(course_id: string, token: string ): Promise<ApiResponse<any>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    }, 
    method: 'DELETE',
    credentials: 'include',
  })
  revalidateTag(`courses:${course_id}`)
  return await response.json()
}

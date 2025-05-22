'use server'

import { revalidateTag } from 'next/cache'

import type { DetailCourse, ListCourse } from '@/models/course-admin'
import type { ApiResponse, ListResponse } from '@/models/response'
import { fetchDataServer } from '@/network/helpers/fetch-data-server'

export async function getCourses(format: 'video' | 'live' | '', isOneOnOne: boolean): Promise<ListResponse<ListCourse>> {
  let url = ''
  if (format === '') {
    url = `/v1/courses/?is_one_on_one=${isOneOnOne}`
  } else {
    url = `/v1/courses/?course_format=${format}&is_one_on_one=${isOneOnOne}`
  }

  const response = await fetchDataServer(url, {
    // cache: 'force-cache',
    next: {
      revalidate: 0,
      tags: [`courses:${format}`],
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
  data: any
): Promise<ApiResponse<DetailCourse>> {
  const response = await fetchDataServer('/v1/courses', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
  })
  revalidateTag(`courses:${data.course_format}`)
  return await response.json()
}

export async function getCoursesBySubscriptionId(subscription_id: string): Promise<ListResponse<ListCourse>> {
  const response = await fetchDataServer(`/v1/courses/?subscription_id=${subscription_id}`, {
    cache: 'force-cache',
    next: {
      revalidate: false,
      tags: [`courses:subscription_id=${subscription_id}`],
    },
  })
  return await response.json()
}

export async function updateCourse(course_id: string, data: any): Promise<ApiResponse<DetailCourse>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
  })
  revalidateTag(`courses:${data.course_format}`)
  return await response.json()
}

export async function deleteCourse(course_id: string): Promise<ApiResponse<any>> {
  const response = await fetchDataServer(`/v1/courses/${course_id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  revalidateTag(`courses:${course_id}`)
  return await response.json()
}
  
  

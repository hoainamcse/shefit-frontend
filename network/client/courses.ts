import type {
  Course,
  CourseLive,
  CourseLivePayload,
  CoursePayload,
  LiveSession,
  LiveSessionPayload,
} from '@/models/course'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

// Course APIs
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

// Course Live APIs
export const queryKeyCourseLives = 'course-lives'

export async function getCourseLives(course_id: Course['id'], params?: any): Promise<ListResponse<CourseLive>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/` + '?' + queryParams)
  return await response.json()
}

export async function createCourseLive(
  course_id: Course['id'],
  data: CourseLivePayload
): Promise<ApiResponse<CourseLive>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateCourseLive(
  course_id: Course['id'],
  class_id: CourseLive['id'],
  data: CourseLivePayload
): Promise<ApiResponse<CourseLive>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteCourseLive(
  course_id: Course['id'],
  class_id: CourseLive['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

// Live Session APIs
export const queryKeyLiveSessions = 'live-sessions'

export async function createLiveSession(
  course_id: Course['id'],
  class_id: CourseLive['id'],
  data: LiveSessionPayload
): Promise<ApiResponse<LiveSession>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}/sessions`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateLiveSession(
  course_id: Course['id'],
  class_id: CourseLive['id'],
  session_id: LiveSession['id'],
  data: LiveSessionPayload
): Promise<ApiResponse<LiveSession>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}/sessions/${session_id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteLiveSession(
  course_id: Course['id'],
  class_id: CourseLive['id'],
  session_id: LiveSession['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}/sessions/${session_id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

import type {
  Course,
  LiveDay,
  LiveDayPayload,
  CoursePayload,
  CourseWeek,
  CourseWeekPayload,
  DayCircuit,
  DayCircuitPayload,
  DaySession,
  DaySessionPayload,
  WeekDay,
  WeekDayPayload,
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

// Course Week APIs
export const queryKeyCourseWeeks = 'course-weeks'

export async function getCourseWeeks(course_id: Course['id'], params?: any): Promise<ListResponse<CourseWeek>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/` + '?' + queryParams)
  return await response.json()
}

export async function createCourseWeek(
  course_id: Course['id'],
  data: CourseWeekPayload
): Promise<ApiResponse<CourseWeek>> {
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateCourseWeek(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  data: CourseWeekPayload
): Promise<ApiResponse<CourseWeek>> {
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteCourseWeek(
  course_id: Course['id'],
  week_id: CourseWeek['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

// Week Day APIs
export const queryKeyWeekDays = 'week-days'

export async function getWeekDays(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  params?: any
): Promise<ListResponse<WeekDay>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days` + '?' + queryParams)
  return await response.json()
}

export async function createWeekDay(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  data: WeekDayPayload
): Promise<ApiResponse<WeekDay>> {
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateWeekDay(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  day_id: WeekDay['id'],
  data: WeekDayPayload
): Promise<ApiResponse<WeekDay>> {
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteWeekDay(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  day_id: WeekDay['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

// Day Circuit APIs
export const queryKeyDayCircuits = 'day-circuits'

export async function getDayCircuits(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  day_id: WeekDay['id'],
  params?: any
): Promise<ListResponse<DayCircuit>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData(
    `/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits` + '?' + queryParams
  )
  return await response.json()
}

export async function createDayCircuit(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  day_id: WeekDay['id'],
  data: DayCircuitPayload
): Promise<ApiResponse<DayCircuit>> {
  const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateDayCircuit(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  day_id: WeekDay['id'],
  circuit_id: DayCircuit['id'],
  data: DayCircuitPayload
): Promise<ApiResponse<DayCircuit>> {
  const response = await fetchData(
    `/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits/${circuit_id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  )
  return await response.json()
}

export async function deleteDayCircuit(
  course_id: Course['id'],
  week_id: CourseWeek['id'],
  day_id: WeekDay['id'],
  circuit_id: DayCircuit['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(
    `/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits/${circuit_id}`,
    {
      method: 'DELETE',
    }
  )
  return await response.json()
}

// Course Live APIs
export const queryKeyLiveDays = 'live-days'

export async function getLiveDays(course_id: Course['id'], params?: any): Promise<ListResponse<LiveDay>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/` + '?' + queryParams)
  return await response.json()
}

export async function createLiveDay(
  course_id: Course['id'],
  data: LiveDayPayload
): Promise<ApiResponse<LiveDay>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateLiveDay(
  course_id: Course['id'],
  class_id: LiveDay['id'],
  data: LiveDayPayload
): Promise<ApiResponse<LiveDay>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteLiveDay(
  course_id: Course['id'],
  class_id: LiveDay['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

// Live Session APIs
export const queryKeyDaySessions = 'day-sessions'

export async function createDaySession(
  course_id: Course['id'],
  class_id: LiveDay['id'],
  data: DaySessionPayload
): Promise<ApiResponse<DaySession>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}/sessions`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateDaySession(
  course_id: Course['id'],
  class_id: LiveDay['id'],
  session_id: DaySession['id'],
  data: DaySessionPayload
): Promise<ApiResponse<DaySession>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}/sessions/${session_id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteDaySession(
  course_id: Course['id'],
  class_id: LiveDay['id'],
  session_id: DaySession['id']
): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/courses/${course_id}/live-classes/${class_id}/sessions/${session_id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

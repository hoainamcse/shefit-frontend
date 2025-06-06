import type { ApiResponse, ListResponse } from '@/models/response'
import type { BodyQuizUser, UserBodyQuiz, UserBodyQuizPayload } from '@/models/body-quiz'

import { fetchData } from '../helpers/fetch-data'

// Body Quiz User APIs
export const queryKeyBodyQuizUsers = 'body-quiz-users'

export async function getBodyQuizUsers(params?: any): Promise<ListResponse<BodyQuizUser>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/users/body-quizzes-summary' + '?' + queryParams)
  return await response.json()
}

// User Body Quiz APIs
export const queryKeyUserBodyQuizzes = 'user-body-quizzes'

export async function getUserBodyQuizzes(
  user_id: BodyQuizUser['id'],
  params?: any
): Promise<ListResponse<UserBodyQuiz>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData(`/v1/users/${user_id}/body-quizzes` + '?' + queryParams)
  return await response.json()
}

export async function updateUserBodyQuiz(
  id: UserBodyQuiz['id'],
  data: UserBodyQuizPayload
): Promise<ApiResponse<UserBodyQuiz>> {
  const response = await fetchData(`/v1/users/body-quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

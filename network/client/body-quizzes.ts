import type { ApiResponse, ListResponse } from '@/models/response'
import type {
  BodyQuiz,
  BodyQuizPayload,
  BodyQuizUser,
  Question,
  QuestionPayload,
  UserBodyQuiz,
  UserBodyQuizPayload,
} from '@/models/body-quiz'

import { fetchData } from '../helpers/fetch-data'

// Body Quiz APIs
export const queryKeyBodyQuizzes = 'body-quizzes'

export async function getBodyQuizzes(params?: any): Promise<ListResponse<BodyQuiz>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/body-quizzes' + '?' + queryParams)
  return await response.json()
}

export async function createBodyQuiz(data: BodyQuizPayload): Promise<ApiResponse<BodyQuiz>> {
  const response = await fetchData('/v1/body-quizzes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function getBodyQuiz(id: BodyQuiz['id']): Promise<ApiResponse<BodyQuiz>> {
  const response = await fetchData(`/v1/body-quizzes/${id}`)
  return await response.json()
}

export async function updateBodyQuiz(id: BodyQuiz['id'], data: BodyQuizPayload): Promise<ApiResponse<BodyQuiz>> {
  const response = await fetchData(`/v1/body-quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteBodyQuiz(id: BodyQuiz['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/body-quizzes/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

// Question APIs
export const queryKeyQuestions = 'questions'

export async function createQuestion(data: QuestionPayload): Promise<ApiResponse<Question>> {
  const response = await fetchData('/v1/questions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateQuestion(id: Question['id'], data: QuestionPayload): Promise<ApiResponse<Question>> {
  const response = await fetchData(`/v1/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteQuestion(id: Question['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/questions/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

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

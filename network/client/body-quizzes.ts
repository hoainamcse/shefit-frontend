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

export async function getBodyQuizzes(query?: any): Promise<ListResponse<BodyQuiz>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/body-quizzes' + '?' + searchParams)
  return response.json()
}

export async function createBodyQuiz(data: BodyQuizPayload): Promise<ApiResponse<BodyQuiz>> {
  const response = await fetchData('/v1/body-quizzes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function getBodyQuiz(id: BodyQuiz['id']): Promise<ApiResponse<BodyQuiz>> {
  const response = await fetchData(`/v1/body-quizzes/${id}`)
  return response.json()
}

export async function updateBodyQuiz(id: BodyQuiz['id'], data: BodyQuizPayload): Promise<ApiResponse<BodyQuiz>> {
  const response = await fetchData(`/v1/body-quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteBodyQuiz(id: BodyQuiz['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/body-quizzes/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// Question APIs
export const queryKeyQuestions = 'questions'

export async function createQuestion(data: QuestionPayload): Promise<ApiResponse<Question>> {
  const response = await fetchData('/v1/questions', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateQuestion(id: Question['id'], data: QuestionPayload): Promise<ApiResponse<Question>> {
  const response = await fetchData(`/v1/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteQuestion(id: Question['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/questions/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// Body Quiz User APIs
export const queryKeyBodyQuizUsers = 'body-quiz-users'

export async function getBodyQuizUsers(query?: any): Promise<ListResponse<BodyQuizUser>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/users/body-quizzes-summary' + '?' + searchParams)
  return response.json()
}

// User Body Quiz APIs
export const queryKeyUserBodyQuizzes = 'user-body-quizzes'

export async function getUserBodyQuizzes(
  user_id: BodyQuizUser['id'],
  query?: any
): Promise<ListResponse<UserBodyQuiz>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData(`/v1/users/${user_id}/body-quizzes` + '?' + searchParams)
  return response.json()
}

export async function updateUserBodyQuiz(
  id: UserBodyQuiz['id'],
  data: UserBodyQuizPayload
): Promise<ApiResponse<UserBodyQuiz>> {
  const response = await fetchData(`/v1/users/body-quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

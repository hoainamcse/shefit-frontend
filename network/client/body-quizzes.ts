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
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData('/v1/body-quizzes' + searchParams)
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

export async function getAttempedUsers(query?: any): Promise<ListResponse<BodyQuizUser>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData('/v1/body-quizzes/users' + searchParams)
  return response.json()
}

export async function attemptBodyQuiz(data: UserBodyQuizPayload): Promise<ApiResponse<UserBodyQuiz>> {
  const response = await fetchData(`/v1/body-quizzes/attempts`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function getBodyQuizHistory(attempt_id: number): Promise<ApiResponse<UserBodyQuiz>> {
  const response = await fetchData(`/v1/body-quizzes/attempts/${attempt_id}`)
  return response.json()
}

export async function updateBodyQuizHistory(
  attempt_id: number,
  data: UserBodyQuizPayload
): Promise<ApiResponse<UserBodyQuiz>> {
  const response = await fetchData(`/v1/body-quizzes/attempts/${attempt_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
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

// User Body Quiz APIs
export async function getBodyQuizzesHistoryByUsers(query?: any): Promise<ListResponse<UserBodyQuiz>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/users/body-quizzes/attempts` + searchParams)
  return response.json()
}

export async function getBodyQuizzesHistoryByUser(
  userId: BodyQuizUser['id'],
  query?: any
): Promise<ListResponse<UserBodyQuiz>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData(`/v1/users/${userId}/body-quizzes/attempts` + searchParams)
  return response.json()
}

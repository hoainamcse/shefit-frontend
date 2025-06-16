'use server'

import type { BodyQuiz, UserBodyQuiz } from '@/models/body-quiz'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

// Body Quiz
export async function getBodyQuizzes(): Promise<ListResponse<BodyQuiz>> {
  const response = await fetchDataServer(`/v1/body-quizzes`, {
    method: 'GET',
  })
  return await response.json()
}

export async function getBodyQuiz(quizId: BodyQuiz['id']): Promise<ApiResponse<BodyQuiz>> {
  const response = await fetchDataServer(`/v1/body-quizzes/${quizId}`, {
    method: 'GET',
  })
  return await response.json()
}

// User Body Quiz
export const getBodyQuizzesByUser = async (id: string): Promise<ListResponse<UserBodyQuiz>> => {
  const response = await fetchDataServer(`/v1/users/${id}/body-quizzes`)
  return await response.json()
}

export const getBodyQuizResultByUser = async (id: UserBodyQuiz['id']): Promise<ApiResponse<UserBodyQuiz>> => {
  const response = await fetchDataServer(`/v1/users/body-quizzes/${id}`)
  return await response.json()
}

export async function createBodyQuizByUser(id: string, data: any): Promise<ListResponse<UserBodyQuiz>> {
  const response = await fetchDataServer(`/v1/users/${id}/body-quizzes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

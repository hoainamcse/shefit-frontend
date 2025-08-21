'use server'

import type { User } from '@/models/user'
import type { BodyQuiz, UserBodyQuiz } from '@/models/body-quiz'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

// Body Quiz
export async function getBodyQuizzes(): Promise<ListResponse<BodyQuiz>> {
  const response = await fetchDataServer(`/v1/body-quizzes`, {
    method: 'GET',
  })
  return response.json()
}

export async function getBodyQuiz(quizId: BodyQuiz['id']): Promise<ApiResponse<BodyQuiz>> {
  const response = await fetchDataServer(`/v1/body-quizzes/${quizId}`, {
    method: 'GET',
  })
  return response.json()
}

// User Body Quiz
export const getBodyQuizzesByUser = async (user_id: User['id']): Promise<ListResponse<UserBodyQuiz>> => {
  const response = await fetchDataServer(`/v1/users/${user_id}/body-quizzes`)
  return response.json()
}

export const getBodyQuizResultByUser = async (id: UserBodyQuiz['id']): Promise<ApiResponse<UserBodyQuiz>> => {
  const response = await fetchDataServer(`/v1/users/body-quizzes/${id}`)
  return response.json()
}

export async function createBodyQuizByUser(id: string, data: any): Promise<ListResponse<UserBodyQuiz>> {
  const response = await fetchDataServer(`/v1/users/${id}/body-quizzes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

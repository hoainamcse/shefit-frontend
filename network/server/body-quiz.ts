import { fetchData } from '../helpers/fetch-data'
import { ApiResponse } from '@/models/response'

import { QuestionData, QuizFormData } from '@/components/forms/types'

/* Question */
export async function createQuestion(question: QuestionData): Promise<ApiResponse<QuestionData>> {
  const response = await fetchData(`/v1/questions`, {
    method: 'POST',
    body: JSON.stringify(question),
    // credentials: 'include',
  })
  return await response.json()
}

export async function updateQuestion(questionId: number, question: QuestionData): Promise<ApiResponse<QuestionData>> {
  const response = await fetchData(`/v1/questions/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify(question),
    // credentials: 'include',
  })
  return await response.json()
}

export async function deleteQuestion(questionId: number): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/questions/${questionId}`, {
    method: 'DELETE',
    // credentials: 'include',
  })
  return await response.json()
}

/* Quiz */
export async function getQuizzes(): Promise<ApiResponse<QuizFormData[]>> {
  const response = await fetchData(`/v1/body-quizzes`, {
    method: 'GET',
  })
  return await response.json()
}

export async function getQuiz(quizId: string): Promise<ApiResponse<QuizFormData>> {
  const response = await fetchData(`/v1/body-quizzes/${quizId}`, {
    method: 'GET',
  })
  return await response.json()
}

export async function createQuiz(quiz: any): Promise<ApiResponse<QuizFormData>> {
  const response = await fetchData(`/v1/body-quizzes`, {
    method: 'POST',
    body: JSON.stringify(quiz),
    // credentials: 'include',
  })
  return await response.json()
}

export async function updateQuiz(quizId: number, quiz: any): Promise<ApiResponse<QuizFormData>> {
  const response = await fetchData(`/v1/body-quizzes/${quizId}`, {
    method: 'PUT',
    body: JSON.stringify(quiz),
    // credentials: 'include',
  })
  return await response.json()
}

export async function deleteQuiz(quizId: number): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/body-quizzes/${quizId}`, {
    method: 'DELETE',
    // credentials: 'include',
  })
  return await response.json()
}

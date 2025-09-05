'use server'

import type { Exercise } from '@/models/exercise'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getExercises(): Promise<ListResponse<Exercise>> {
  const response = await fetchDataServer(`/v1/exercises/`)
  return response.json()
}

export async function getExercise(id: string): Promise<ApiResponse<Exercise>> {
  const response = await fetchDataServer(`/v1/exercises/${id}`)
  return response.json()
}

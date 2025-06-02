'use server'

import type { Exercise } from '@/models/exercise'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getExercises(): Promise<ListResponse<Exercise>> {
  const response = await fetchDataServer(`/v1/exercises/`, {
    next: {
      tags: [`exercises`],
    },
  })
  return await response.json()
}

export async function getExerciseById(id: string): Promise<ApiResponse<Exercise>> {
  const response = await fetchDataServer(`/v1/exercises/${id}`, {
    next: {
      tags: [`exercises`],
    },
  })
  return await response.json()
}

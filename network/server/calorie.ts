'use server'

import type { ListResponse } from '@/models/response'
import type { Calorie } from '@/models/calorie'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCalories(): Promise<ListResponse<Calorie>> {
  const response = await fetchDataServer('/v1/calories/')
  return await response.json()
}

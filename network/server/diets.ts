'use server'

import type { ListResponse } from '@/models/response'
import type { Diet } from '@/models/diet'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getDiets(query?: any): Promise<ListResponse<Diet>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/diets/?' + searchParams)
  return await response.json()
}

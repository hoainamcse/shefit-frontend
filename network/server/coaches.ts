'use server'

import type { ListResponse } from '@/models/response'
import type { Coach } from '@/models/coach'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCoaches(query?: any): Promise<ListResponse<Coach>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/coaches?' + searchParams)
  return await response.json()
}

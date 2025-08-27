'use server'

import type { Topic } from '@/models/topic'
import type { ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getTopics(query?: any): Promise<ListResponse<Topic>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/topics' + '?' + searchParams)
  return response.json()
}

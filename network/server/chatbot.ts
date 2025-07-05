import type { ApiResponse } from '@/models/response'
import type { TotalTokenUsage } from '@/models/chatbot'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getTotalTokenUsage(): Promise<ApiResponse<TotalTokenUsage>> {
  const response = await fetchDataServer('/v1/chatbot/token-usage/total')
  return response.json()
}

'use server'

import type { ApiResponse } from '@/models/response'
import type { Configuration } from '@/models/configuration'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getConfiguration(id: Configuration['id']): Promise<ApiResponse<Configuration>> {
  const response = await fetchDataServer(`/v1/configurations/${id}`, {
    method: 'GET',
  })
  return response.json()
}

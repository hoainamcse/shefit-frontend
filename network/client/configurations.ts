import type { Configuration, ConfigurationPayload } from '@/models/configuration'
import type { Dashboard } from '@/models/configuration'
import type { ApiResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyConfigurations = 'configurations'

export async function getConfiguration(id: Configuration['id']): Promise<ApiResponse<Configuration>> {
  const response = await fetchData(`/v1/configurations/${id}`, {
    method: 'GET',
  })
  return response.json()
}

export async function updateConfiguration(
  id: Configuration['id'],
  data: ConfigurationPayload
): Promise<ApiResponse<Configuration>> {
  const response = await fetchData(`/v1/configurations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function getDashboard(): Promise<ApiResponse<Dashboard>> {
  const response = await fetchData('/v1/sub_admin/count')
  return response.json()
}

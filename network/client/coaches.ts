import type { ApiResponse, ListResponse } from '@/models/response'
import type { Coach, CoachPayload } from '@/models/coach'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyCoaches = 'coaches'

export async function getCoaches(params?: any): Promise<ListResponse<Coach>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/coaches' + '?' + queryParams)
  return await response.json()
}

export async function createCoach(data: CoachPayload): Promise<ApiResponse<Coach>> {
  const response = await fetchData('/v1/coaches', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateCoach(id: Coach['id'], data: CoachPayload): Promise<ApiResponse<Coach>> {
  const response = await fetchData(`/v1/coaches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteCoach(id: Coach['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/coaches/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

export async function deleteBulkCoach(ids: Coach['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/coaches/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return await response.json()
}

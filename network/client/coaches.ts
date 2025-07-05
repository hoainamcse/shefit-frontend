import type { ApiResponse, ListResponse } from '@/models/response'
import type { Coach, CoachPayload } from '@/models/coach'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyCoaches = 'coaches'

export async function getCoaches(query?: any): Promise<ListResponse<Coach>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/coaches' + '?' + searchParams)
  return response.json()
}

export async function createCoach(data: CoachPayload): Promise<ApiResponse<Coach>> {
  const response = await fetchData('/v1/coaches', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateCoach(id: Coach['id'], data: CoachPayload): Promise<ApiResponse<Coach>> {
  const response = await fetchData(`/v1/coaches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteCoach(id: Coach['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/coaches/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkCoach(ids: Coach['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/coaches/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

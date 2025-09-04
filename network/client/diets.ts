import type { Diet, DietPayload } from '@/models/diet'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyDiets = 'diets'

export async function getDiets(query?: any): Promise<ListResponse<Diet>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchData('/v1/diets' + searchParams)
  return response.json()
}

export async function getDiet(id: Diet['id']): Promise<ApiResponse<Diet>> {
  const response = await fetchData(`/v1/diets/${id}`)
  return response.json()
}

export async function createDiet(data: { diets: DietPayload[] }): Promise<ApiResponse<Diet[]>> {
  const response = await fetchData('/v1/diets:bulkCreate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateDiet(id: Diet['id'], data: DietPayload): Promise<ApiResponse<Diet>> {
  const response = await fetchData(`/v1/diets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteDiet(ids: Diet['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/diets:bulkDeleteByIds`, {
    method: 'POST',
    body: JSON.stringify(ids),
  })
  return response.json()
}

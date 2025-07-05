import type { ApiResponse, ListResponse } from '@/models/response'
import type { Equipment, EquipmentPayload } from '@/models/equipment'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyEquipments = 'equipments'

export async function getEquipments(query?: any): Promise<ListResponse<Equipment>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/equipments' + '?' + searchParams)
  return response.json()
}

export async function createEquipment(data: EquipmentPayload): Promise<ApiResponse<Equipment>> {
  const response = await fetchData('/v1/equipments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateEquipment(id: Equipment['id'], data: EquipmentPayload): Promise<ApiResponse<Equipment>> {
  const response = await fetchData(`/v1/equipments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteEquipment(id: Equipment['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/equipments/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkEquipment(ids: Equipment['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/equipments/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}


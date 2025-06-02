import type { ApiResponse, ListResponse } from '@/models/response'
import type { Equipment, EquipmentPayload } from '@/models/equipment'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyEquipments = 'equipments'

export async function getEquipments(params?: any): Promise<ListResponse<Equipment>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/equipments' + '?' + queryParams)
  return await response.json()
}

export async function createEquipment(data: EquipmentPayload): Promise<ApiResponse<Equipment>> {
  const response = await fetchData('/v1/equipments', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateEquipment(id: Equipment['id'], data: EquipmentPayload): Promise<ApiResponse<Equipment>> {
  const response = await fetchData(`/v1/equipments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteEquipment(id: Equipment['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/equipments/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

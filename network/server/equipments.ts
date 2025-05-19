import type { Equipment } from '@/models/equipments'
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export async function getEquipments(): Promise<ListResponse<Equipment>> {
  const response = await fetchData('/v1/equipments/', {
    next: {
      // revalidate: 0,
      tags: ['equipments'],
    },
  })
  return await response.json()
}

export async function getEquipment(id: string): Promise<ApiResponse<Equipment>> {
  const response = await fetchData(`/v1/equipments/${id}`, {
    method: 'GET',
  })
  return await response.json()
}


export async function createEquipment(data: any): Promise<ApiResponse<Equipment>> {
  const response = await fetchData('/v1/equipments/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}


export async function updateEquipment(id: string, data: any): Promise<ApiResponse<Equipment>> {
  const response = await fetchData(`/v1/equipments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteEquipment(id: string): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/equipments/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}
  

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

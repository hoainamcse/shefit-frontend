'use server'

import type { Equipment } from '@/models/equipment'
import type { ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getEquipments(): Promise<ListResponse<Equipment>> {
  const response = await fetchDataServer('/v1/equipments/')
  return response.json()
}

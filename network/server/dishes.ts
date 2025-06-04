'use server'

import type { Dish } from '@/models/dish'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getDishes(): Promise<ListResponse<Dish>> {
  const response = await fetchDataServer('/v1/dishes', {
    method: 'GET',
    credentials: 'include',
  })
  return await response.json()
}

export async function getDish(dish_id: string): Promise<ApiResponse<Dish>> {
  const response = await fetchDataServer(`/v1/dishes/${dish_id}`, {
    method: 'GET',
    credentials: 'include',
  })
  return await response.json()
}

'use server'

import type { Dish } from '@/models/dish'
import type { ApiResponse, ListResponse } from '@/models/response'
import { Diet } from '@/models/diet'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getDishes(query?: any): Promise<ListResponse<Dish>> {
  const searchParams = query ? `?${new URLSearchParams(query).toString()}` : ''
  const response = await fetchDataServer('/v1/dishes' + searchParams)
  return response.json()
}

export async function getDish(dish_id: string): Promise<ApiResponse<Dish>> {
  const response = await fetchDataServer(`/v1/dishes/${dish_id}`)
  return response.json()
}

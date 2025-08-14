'use server'

import type { Dish } from '@/models/dish'
import type { ApiResponse, ListResponse } from '@/models/response'
import { Diet } from '@/models/diet'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getDishes(): Promise<ListResponse<Dish>> {
  const response = await fetchDataServer('/v1/dishes')
  return response.json()
}

export async function getDish(dish_id: string): Promise<ApiResponse<Dish>> {
  const response = await fetchDataServer(`/v1/dishes/${dish_id}`)
  return response.json()
}

export async function getDishesByDietId(diet_id: Diet['id']): Promise<ListResponse<Dish>> {
  const response = await fetchDataServer(`/v1/diets/${diet_id}/dishes`)
  return response.json()
}
  
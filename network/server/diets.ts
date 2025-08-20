'use server'

import type { ApiResponse, ListResponse } from '@/models/response'
import type { Diet } from '@/models/diet'

import { fetchDataServer } from '../helpers/fetch-data-server'
import { Dish } from '@/models/dish'

export async function getDiet(diet_id: Diet['id']): Promise<ApiResponse<Diet>> {
  const response = await fetchDataServer(`/v1/diets/${diet_id}`)
  return response.json()
}

export async function getDietDishes(diet_id: Diet['id']): Promise<ListResponse<Dish>> {
  const response = await fetchDataServer(`/v1/diets/${diet_id}/dishes`)
  return response.json()
}

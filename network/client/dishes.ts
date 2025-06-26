import type { Dish, DishPayload } from '@/models/dish'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyDishes = 'dishes'

export async function getDishes(params?: any): Promise<ListResponse<Dish>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/dishes/' + '?' + queryParams)
  return await response.json()
}

export async function createDish(data: DishPayload): Promise<ApiResponse<Dish>> {
  const response = await fetchData('/v1/dishes:bulkCreate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function updateDish(id: Dish['id'], data: DishPayload): Promise<ApiResponse<Dish>> {
  const response = await fetchData(`/v1/dishes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteDish(ids: Dish['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/dishes:bulkDeleteByIds`, {
    method: 'POST',
    body: JSON.stringify(ids),
  })
  return await response.json()
}

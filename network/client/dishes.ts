import type { Dish, DishPayload } from '@/models/dish'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyDishes = 'dishes'

export async function getDishes(query?: any): Promise<ListResponse<Dish>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/dishes/' + '?' + searchParams)
  return response.json()
}

export async function createDish(data: DishPayload): Promise<ApiResponse<Dish>> {
  const response = await fetchData('/v1/dishes:bulkCreate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateDish(id: Dish['id'], data: DishPayload): Promise<ApiResponse<Dish>> {
  const response = await fetchData(`/v1/dishes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteDish(ids: Dish['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/dishes:bulkDeleteByIds`, {
    method: 'POST',
    body: JSON.stringify(ids),
  })
  return response.json()
}

export async function importDishExcel(file: File): Promise<ApiResponse<Dish>> {
  const formData = new FormData()
  formData.append('file', file, file.name)
  const response = await fetchData('/v1/dishes/import-excel', {
    method: 'POST',
    body: formData,
  }, false)
  return await response.json()
}
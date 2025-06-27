import type { ApiResponse, ListResponse } from '@/models/response'
import type { Product } from '@/models/product'

import { fetchData } from '../helpers/fetch-data'

export const queryKeyProducts = 'products'

export async function getProducts(params?: any): Promise<ListResponse<Product>> {
  const queryParams = new URLSearchParams(params).toString()
  const response = await fetchData('/v1/products/' + '?' + queryParams)
  return await response.json()
}

export async function deleteProduct(id: Product['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/products/${id}`, {
    method: 'DELETE',
  })
  return await response.json()
}

export async function deleteBulkProduct(ids: Product['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/products/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return await response.json()
}


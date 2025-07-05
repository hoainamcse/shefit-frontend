import type { ApiResponse, ListResponse } from '@/models/response'
import type { Product, ProductCategory, ProductColor, ProductSize } from '@/models/product'

import { fetchData } from '../helpers/fetch-data'
import { Category, Color, Size } from '@/models/category'

export const queryKeyProducts = 'products'

export async function getProducts(query?: any): Promise<ListResponse<Product>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchData('/v1/products/' + '?' + searchParams)
  return response.json()
}

export async function getProduct(product_id: string): Promise<ApiResponse<Product>> {
  const response = await fetchData(`/v1/products/${product_id}`)
  return response.json()
}

export async function createProduct(data: any): Promise<ApiResponse<Product>> {
  const response = await fetchData('/v1/products/', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateProduct(product_id: string, data: any): Promise<ApiResponse<Product>> {
  const response = await fetchData(`/v1/products/${product_id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteProduct(id: Product['id']): Promise<ApiResponse<string>> {
  const response = await fetchData(`/v1/products/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function deleteBulkProduct(ids: Product['id'][]): Promise<ApiResponse<string>> {
  const response = await fetchData('/v1/products/bulk', {
    method: 'DELETE',
    body: JSON.stringify(ids),
  })
  return response.json()
}

// Product Color
export async function getColors(): Promise<ListResponse<ProductColor>> {
  const response = await fetchData('/v1/products/colors')
  return response.json()
}

export async function createColor(data: any): Promise<ApiResponse<Color>> {
  const response = await fetchData('/v1/products/colors', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateColor(data: any, id: string): Promise<ApiResponse<Color>> {
  const response = await fetchData(`/v1/products/colors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteColor(id: string): Promise<ApiResponse<Color>> {
  const response = await fetchData(`/v1/products/colors/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// Product Size
export async function getSizes(): Promise<ListResponse<ProductSize>> {
  const response = await fetchData('/v1/products/sizes')
  return response.json()
}

export async function createSize(data: any): Promise<ApiResponse<Size>> {
  const response = await fetchData('/v1/products/sizes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateSize(data: any, id: string): Promise<ApiResponse<Size>> {
  const response = await fetchData(`/v1/products/sizes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteSize(id: string): Promise<ApiResponse<Size>> {
  const response = await fetchData(`/v1/products/sizes/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

// Product Category
export async function getCategories(): Promise<ListResponse<ProductCategory>> {
  const response = await fetchData('/v1/products/categories')
  return response.json()
}

export async function createCategory(data: any): Promise<ApiResponse<Category>> {
  const response = await fetchData('/v1/products/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateCategory(data: any, id: string): Promise<ApiResponse<Category>> {
  const response = await fetchData(`/v1/products/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteCategory(id: string): Promise<ApiResponse<Category>> {
  const response = await fetchData(`/v1/products/categories/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

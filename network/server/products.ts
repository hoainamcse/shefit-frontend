'use server'

import type { Product } from '@/models/product'

import { fetchDataServer } from '../helpers/fetch-data-server'
import { ListResponse } from '@/models/response'

export async function getProduct(product_id: string): Promise<Product> {
  const response = await fetchDataServer(`/v1/products/${product_id}/`)
  return response.json()
}

export async function getProducts(query?: any): Promise<ListResponse<Product>> {
  const searchParams = new URLSearchParams(query).toString()
  const response = await fetchDataServer('/v1/products/' + '?' + searchParams)
  return response.json()
}

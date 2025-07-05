'use server'

import type { Product } from '@/models/product'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getProduct(product_id: string): Promise<Product> {
  const response = await fetchDataServer(`/v1/products/${product_id}/`)
  return response.json()
}

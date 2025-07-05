'use server'

import type { Cart } from '@/models/cart'

import { fetchDataServer } from '../helpers/fetch-data-server'

export async function getCart(id: number): Promise<Cart> {
  const response = await fetchDataServer(`/v1/carts/${id}`)
  return response.json()
}

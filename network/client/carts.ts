import type { Cart } from '@/models/cart'
import type { ApiResponse, ListResponse } from '@/models/response'

import { fetchData } from '../helpers/fetch-data'

export async function createCart(): Promise<Cart> {
  const defaultCartPayload = {
    user_name: '',
    username: '',
    is_signed_up: false,
    telephone_number: '',
    city: '',
    is_hcm: false,
    address: '',
    total_weight: 0,
    shipping_fee: 0,
    total: 0,
    payment_method: 'not_decided',
    status: 'pending',
    notes: '',
    product_variant_ids: [],
  }

  const response = await fetchData(`/v1/carts`, {
    method: 'POST',
    body: JSON.stringify(defaultCartPayload),
  })
  return response.json()
}

export async function getCart(id: number): Promise<Cart> {
  const response = await fetchData(`/v1/carts/${id}`)
  return response.json()
}

export async function getCarts(): Promise<ListResponse<Cart>> {
  const response = await fetchData('/v1/carts')
  return response.json()
}

export async function addCart(cartId: number, productVariantId: number, quantity: number = 1): Promise<Cart> {
  const validQuantity = Math.max(1, Number(quantity) || 1)
  const requestBody = {
    product_variant_id: productVariantId,
    quantity: validQuantity,
  }

  const response = await fetchData(`/v1/carts/${cartId}:addProductVariant`, {
    method: 'POST',
    body: JSON.stringify(requestBody),
  })

  return response.json()
}

export async function removeCart(cartId: number, productVariantId: number): Promise<Cart> {
  const response = await fetchData(`/v1/carts/${cartId}:removeProductVariant`, {
    method: 'POST',
    body: JSON.stringify({
      product_variant_id: productVariantId,
      quantity: 0,
    }),
  })
  return response.json()
}

export async function editCart(id: number, data: any): Promise<ApiResponse<Cart>> {
  const response = await fetchData(`/v1/carts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteCart(id: number): Promise<ApiResponse<any>> {
  const response = await fetchData(`/v1/carts/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

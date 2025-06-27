'use server'

import type { Product, ProductColor, ProductSize, ProductCategory } from "@/models/product"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "@/models/response"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { revalidateTag } from "next/cache"

export async function getProducts(query?: any): Promise<ListResponse<Product>> {
    const searchParams = new URLSearchParams(query).toString()
    const response = await fetchData("/v1/products/?" + searchParams, {
        next: {
            revalidate: 3600,
            tags: ["products"],
        },
    })
    return await response.json()
}

export async function getProduct(product_id: string): Promise<Product> {
    const response = await fetchData(`/v1/products/${product_id}/`, {
        next: {
            revalidate: 3600,
            tags: ["products"],
        },
    })
    return await response.json()
}

export async function getColors(): Promise<ListResponse<ProductColor>> {
    const response = await fetchData("/v1/products/colors", {
        next: {
            revalidate: 3600,
            tags: ["products"],
        },
    })
    return await response.json()
}

export async function getSizes(): Promise<ListResponse<ProductSize>> {
    const response = await fetchData("/v1/products/sizes", {
        next: {
            revalidate: 3600,
            tags: ["products"],
        },
    })
    return await response.json()
}

export async function getCategories(): Promise<ListResponse<ProductCategory>> {
    const response = await fetchData("/v1/products/categories", {
        next: {
            revalidate: 3600,
            tags: ["products"],
        },
    })
    return await response.json()
}

export async function createProduct(
    data: any
  ): Promise<ApiResponse<Product>> {
    const response = await fetchDataServer('/v1/products/', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
    })
    revalidateTag(`products`)
    return await response.json()
  }

  export async function updateProduct(
    product_id: string,
    data: any
  ): Promise<ApiResponse<Product>> {
    const response = await fetchDataServer(`/v1/products/${product_id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'include',
    })
    revalidateTag(`products`)
    return await response.json()
  }

  export async function deleteProduct(product_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/products/${product_id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    revalidateTag(`products`)
    return await response.json()
  }

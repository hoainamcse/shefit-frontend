import type { Product, ProductColor, ProductSize, ProductCategory } from "@/models/products"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "@/models/response"

export async function getProducts(): Promise<ListResponse<Product>> {
    const response = await fetchData("/v1/products/", {
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
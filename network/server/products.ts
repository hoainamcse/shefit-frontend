import type { Product } from "@/models/products"
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

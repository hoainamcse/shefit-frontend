import type { Cart } from "@/models/cart"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "@/models/response"
import { Product, ProductColor, ProductSize } from "@/models/products"

export async function getCarts(): Promise<ListResponse<Cart>> {
    const response = await fetchData("/v1/carts", { next: { tags: ["cart"] } })
    return await response.json()
}
export async function getCart(id: number): Promise<Cart> {
    const response = await fetchData(`/v1/carts/${id}`, { next: { tags: ["cart"] } })
    return await response.json()
}

export async function addCart(id: number, productVariantId: number): Promise<Cart> {
    const response = await fetchData(`/v1/carts/${id}:addProductVariant`, {
        method: "POST",
        body: JSON.stringify({ product_variant_id: productVariantId }),
        next: { tags: ["cart"] },
    })
    return await response.json()
}

export async function removeCart(id: number, productVariantId: number): Promise<Cart> {
    const response = await fetchData(`/v1/carts/${id}:removeProductVariant`, {
        method: "POST",
        body: JSON.stringify({ product_variant_id: productVariantId }),
        next: { tags: ["cart"] },
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
'use server'

import type { Cart } from "@/models/cart"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "@/models/response"
import { Product, ProductColor, ProductSize } from "@/models/product"
import { revalidateTag } from "next/cache"
import { fetchDataServer } from "../helpers/fetch-data-server"

export async function createCart(): Promise<Cart> {
    const defaultCartPayload = {
        user_name: "",
        username: "",
        is_signed_up: false,
        telephone_number: "",
        city: "",
        is_hcm: false,
        address: "",
        total_weight: 0,
        shipping_fee: 0,
        total: 0,
        payment_method: "not_decided",
        status: "pending",
        notes: "",
        product_variant_ids: []
    };

    const response = await fetchDataServer(
        `/v1/carts`,
        {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(defaultCartPayload),
        }
    )
    revalidateTag("cart")
    return await response.json()
}

export async function getCarts(): Promise<ListResponse<Cart>> {
    const response = await fetchData("/v1/carts", { next: { tags: ["cart"] } })
    return await response.json()
}
export async function getCart(id: number): Promise<Cart> {
    const response = await fetchData(`/v1/carts/${id}`, { next: { tags: ["cart"] } })
    return await response.json()
}

export async function addCart(cartId: number, productVariantId: number, quantity: number = 1): Promise<Cart> {
    const validQuantity = Math.max(1, Number(quantity) || 1);

    console.log('addCart request:', {
        cartId,
        productVariantId,
        originalQuantity: quantity,
        validQuantity
    });

    const requestBody = {
        product_variant_id: productVariantId,
        quantity: validQuantity
    };

    console.log('Request body:', JSON.stringify(requestBody));

    const response = await fetchData(
        `/v1/carts/${cartId}:addProductVariant`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            next: { tags: ["cart"] },
        }
    )

    const result = await response.json();
    console.log('addCart response:', result);
    return result;
}

export async function removeCart(cartId: number, productVariantId: number): Promise<Cart> {
    const response = await fetchData(
        `/v1/carts/${cartId}:removeProductVariant`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                product_variant_id: productVariantId,
                quantity: 0
            }),
            next: { tags: ["cart"] },
        }
    )
    return await response.json()
}


export async function getProduct(product_id: string): Promise<Product> {
    const response = await fetchData(`/v1/products/${product_id}/`, {
        next: {
            revalidate: 0,
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

export async function editCart(id: number, data: any): Promise<ApiResponse<Cart>> {
    const response = await fetchDataServer(
        `/v1/carts/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: 'include',
        }
    )
    revalidateTag("cart")
    return await response.json()
}

export async function deleteCart(id: number): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(
        `/v1/carts/${id}`,
        {
            method: "DELETE",
            credentials: 'include',
        }
    )
    revalidateTag("cart")
    return await response.json()
}


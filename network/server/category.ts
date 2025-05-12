'use server'

import { ApiResponse, ListResponse } from "@/models/response"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { Category, Color, Size } from "@/models/category"
import { revalidateTag } from "next/cache"


export async function getCategories(): Promise<ListResponse<Category>> {
    const response = await fetchDataServer("/v1/products/categories", {
        next: {
            revalidate: 3600,
            tags: ["categories"],
        },
    })
    return await response.json()
}

export async function createCategory(data: any): Promise<ApiResponse<Category>> {
    const response = await fetchDataServer("/v1/products/categories", {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag("categories")
    return await response.json()
}

export async function updateCategory(data: any, id: string): Promise<ApiResponse<Category>> {
    const response = await fetchDataServer(`/v1/products/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag("categories")
    return await response.json()
}

export async function deleteCategory(id: string): Promise<ApiResponse<Category>> {
    const response = await fetchDataServer(`/v1/products/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag("categories")
    return await response.json()
}


export async function getColors(): Promise<ListResponse<Color>> {
    const response = await fetchDataServer("/v1/products/colors", {
        next: {
            revalidate: 3600,
            tags: ["colors"],
        },
    })
    return await response.json()
}

export async function createColor(data: any): Promise<ApiResponse<Color>> {
    const response = await fetchDataServer("/v1/products/colors", {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag("colors")
    return await response.json()
}

export async function updateColor(data: any, id: string): Promise<ApiResponse<Color>> {
    const response = await fetchDataServer(`/v1/products/colors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag("colors")
    return await response.json()
}

export async function deleteColor(id: string): Promise<ApiResponse<Color>> {
    const response = await fetchDataServer(`/v1/products/colors/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag("colors")
    return await response.json()
}

export async function getSizes(): Promise<ListResponse<Size>> {
    const response = await fetchDataServer("/v1/products/sizes", {
        next: {
            revalidate: 3600,
            tags: ["sizes"],
        },
    })
    return await response.json()
}

export async function createSize(data: any): Promise<ApiResponse<Size>> {
    const response = await fetchDataServer("/v1/products/sizes", {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag("sizes")
    return await response.json()
}

export async function updateSize(data: any, id: string): Promise<ApiResponse<Size>> {
    const response = await fetchDataServer(`/v1/products/sizes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag("sizes")
    return await response.json()
}

export async function deleteSize(id: string): Promise<ApiResponse<Size>> {
    const response = await fetchDataServer(`/v1/products/sizes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag("sizes")
    return await response.json()
}






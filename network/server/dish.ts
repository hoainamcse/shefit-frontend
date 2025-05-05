'use server'

import { Dish } from "@/models/dish"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"


export async function getListDishes() : Promise<ListResponse<Dish>> {
    const response = await fetchDataServer('/v1/dishes', {
        method: 'GET',
        credentials: 'include',
    })
    revalidateTag(`dishes`)
    return await response.json()
}

export async function createDish(data: any[] ): Promise<ListResponse<Dish>> {
    const response = await fetchDataServer('/v1/dishes:bulkCreate', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`dishes`)
    return await response.json()
}

export async function updateDish(dish_id: string, data: any): Promise<ApiResponse<Dish>> {
    const response = await fetchDataServer(`/v1/dishes/${dish_id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`dishes`)
    return await response.json()
}

export async function deleteDish(dishIds: number[]): Promise<ListResponse<Dish>> {
    const response = await fetchDataServer(`/v1/dishes:bulkDeleteByIds`, {
        method: 'POST',
        body: JSON.stringify(dishIds),
        credentials: 'include',
    })
    revalidateTag(`dishes`)
    return await response.json()
}

export async function getDetailDish(dish_id: string): Promise<ApiResponse<Dish>> {
    const response = await fetchDataServer(`/v1/dishes/${dish_id}`, {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}
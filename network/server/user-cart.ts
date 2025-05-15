import type { UserCart } from "../../models/user-cart"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse } from "../../models/response"

export const getUserCart = async (userId: number): Promise<ApiResponse<UserCart>> => {
    const response = await fetchData(`/v1/users/${userId}/carts`, {
    })
    return response.json()
}

export const createCart = async (userId: number): Promise<UserCart> => {
    const response = await fetchData(`/v1/users/${userId}/carts`, {
    })
    return response.json()
}
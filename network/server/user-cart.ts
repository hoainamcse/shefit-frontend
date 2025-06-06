'use server'

import type { UserCart } from "../../models/user-cart"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse } from "../../models/response"

export const getUserCart = async (userId: number): Promise<ApiResponse<UserCart[]>> => {
    const response = await fetchData(`/v1/users/${userId}/carts`, {
    })
    return response.json()
}

// This function creates a user-cart association with a specified cart ID
export const createUserCart = async (userId: number, cartId: number): Promise<UserCart> => {
    try {
        const response = await fetchData(
            `/v1/users/${userId}/carts`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    cart_id: cartId
                }),
            },
        )
        return await response.json()
    } catch (error) {
        console.error('Error creating user cart association:', error)
        throw error;
    }
}
'use server'

import { revalidateTag } from "next/cache"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { ApiResponse, ListResponse } from "@/models/response"
import { User } from "@/models/user"
import { fetchData } from "../helpers/fetch-data"

export const register = async (data: any) => {
    const response = await fetchData("/v1/auth:signUp", {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to register");
    }

    return response.json();
};

export async function getUsers(): Promise<ListResponse<User>> {
    const response = await fetchDataServer(`/v1/users`, {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}

export async function getUserById(user_id: string): Promise<ApiResponse<User>> {
    const response = await fetchDataServer(`/v1/users/${user_id}`, {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}

export async function updateUser(user_id: string, data: any): Promise<ApiResponse<User>> {
    const response = await fetchDataServer(`/v1/users/${user_id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`users`)
    return await response.json()
}

export async function deleteUser(user_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag(`users`)
    return await response.json()
}

export async function updatePassword(data: any): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/auth:changePassword`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    return await response.json()
}
    







    

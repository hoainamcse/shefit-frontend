'use server'

import { ApiResponse, ListResponse } from "@/models/response";
import { fetchDataServer } from "../helpers/fetch-data-server";
import { UserExercise } from "@/models/user-exercises";
import { revalidateTag } from "next/cache";

export async function getUserExercises(userId: string): Promise<ListResponse<UserExercise>> {
    const response = await fetchDataServer(`/v1/users/${userId}/exercises`, {
        method: 'GET',
        credentials: 'include',
    })
    return await response.json()
}

export async function createUserExercise(data: any, user_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/exercises`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
    })
    revalidateTag(`user-exercises:${user_id}`)
    return await response.json()
}

export async function deleteUserExercise(user_id: string, exercise_id: string): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/users/${user_id}/exercises/${exercise_id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    revalidateTag(`user-exercises:${user_id}`)
    return await response.json()
}



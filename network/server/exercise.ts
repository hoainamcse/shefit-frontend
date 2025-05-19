'use server'

import { ApiResponse, ListResponse } from "@/models/response"
import { fetchDataServer } from "../helpers/fetch-data-server"
import { Exercise } from "@/models/exercies"
import { revalidateTag } from "next/cache"


export async function getExercises(): Promise<ListResponse<Exercise>> {
    const response = await fetchDataServer(`/v1/exercises/`, {
      next: {
        tags: [`exercises`],
      },
    })
    return await response.json()
}

export async function getExerciseById(id: string): Promise<ApiResponse<Exercise>> {
    const response = await fetchDataServer(`/v1/exercises/${id}`, {
      next: {
        tags: [`exercises`],
      },
    })
    return await response.json()
}

export async function createExercise(data: any): Promise<ApiResponse<Exercise>> {
    const response = await fetchDataServer(`/v1/exercises/`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    revalidateTag(`exercises`)
    return await response.json()
}

export async function updateExercise(id: number, data: any): Promise<ApiResponse<Exercise>> {
    const response = await fetchDataServer(`/v1/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    revalidateTag(`exercises`)
    return await response.json()
}

export async function deleteExercise(id: number): Promise<ApiResponse<any>> {
    const response = await fetchDataServer(`/v1/exercises/${id}`, {
      method: 'DELETE',
    })
    revalidateTag(`exercises`)
    return await response.json()
}
    
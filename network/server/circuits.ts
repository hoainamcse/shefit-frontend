'use server'
import type { Circuit } from "@/models/circuits"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"

export async function getCircuits(course_id: string, week_id: string, day_id: string): Promise<ListResponse<Circuit>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits`, { next: { tags: ["circuits"] } })
    return await response.json()
}

export async function createCircuit(course_id: string, week_id: string, day_id: string, circuit: any): Promise<ApiResponse<Circuit>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits`, {
        method: "POST",
        body: JSON.stringify(circuit),
    })
    revalidateTag(`circuits:${course_id}:${week_id}:${day_id}`)
    return await response.json()
}

export async function updateCircuit(course_id: string, week_id: string, day_id: string, circuit_id: string, circuit: any): Promise<ApiResponse<Circuit>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits/${circuit_id}`, {
        method: "PUT",
        body: JSON.stringify(circuit),
    })
    revalidateTag(`circuits:${course_id}:${week_id}:${day_id}`)
    return await response.json()
}

export async function deleteCircuit(course_id: string, week_id: string, day_id: string, circuit_id: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits/${circuit_id}`, {
        method: "DELETE",
    })
    revalidateTag(`circuits:${course_id}:${week_id}:${day_id}`)
    return await response.json()
}



'use server'
import type { Circuit } from "@/models/circuits"
import type { Course } from "@/models/course"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"
import { Week } from "@/models/weeks"
import { Day } from "@/models/days"

export async function getCircuits(course_id: Course['id'], week_id: Week['id'], day_id: Day['id']): Promise<ListResponse<Circuit>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits`, { next: { tags: ["circuits"] } })
    return await response.json()
}

export async function createCircuit(course_id: Course['id'], week_id: Week['id'], day_id: Day['id'], circuit: any): Promise<ApiResponse<Circuit>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits`, {
        method: "POST",
        body: JSON.stringify(circuit),
    })
    revalidateTag(`circuits:${course_id}:${week_id}:${day_id}`)
    return await response.json()
}

export async function updateCircuit(course_id: Course['id'], week_id: Week['id'], day_id: Day['id'], circuit_id: string, circuit: any): Promise<ApiResponse<Circuit>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits/${circuit_id}`, {
        method: "PUT",
        body: JSON.stringify(circuit),
    })
    revalidateTag(`circuits:${course_id}:${week_id}:${day_id}`)
    return await response.json()
}

export async function deleteCircuit(course_id: Course['id'], week_id: Week['id'], day_id: Day['id'], circuit_id: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits/${circuit_id}`, {
        method: "DELETE",
    })
    revalidateTag(`circuits:${course_id}:${week_id}:${day_id}`)
    return await response.json()
}



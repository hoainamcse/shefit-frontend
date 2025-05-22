'use server'

import type { Day } from "@/models/days"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"

export async function getDays(course_id: string, week_id: string): Promise<ListResponse<Day>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days`, { next: { tags: ["days"] } })
    return await response.json()
}

export async function createDay(course_id: string, week_id: string, day: any): Promise<ApiResponse<Day>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days`, {
        method: "POST",
        body: JSON.stringify(day),
    })
    revalidateTag(`days:${course_id}:${week_id}`)
    return await response.json()
}

export async function updateDay(course_id: string, week_id: string, day_id: string, day: any): Promise<ApiResponse<Day>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}`, {
        method: "PATCH",
        body: JSON.stringify(day),
    })
    revalidateTag(`days:${course_id}:${week_id}`)
    return await response.json()
}

export async function deleteDay(course_id: string, week_id: string, day_id: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}`, {
        method: "DELETE",
    })
    revalidateTag(`days:${course_id}:${week_id}`)
    return await response.json()
}
    

'use server'

import type { Week } from "@/models/weeks"
import type { Course } from "@/models/course"
import { fetchData } from "../helpers/fetch-data"
import { ApiResponse, ListResponse } from "@/models/response"
import { revalidateTag } from "next/cache"

export async function getWeeks(course_id: Course['id']): Promise<ListResponse<Week>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/`, { next: { tags: ["weeks"] } })
    return await response.json()
}

export async function createWeek(course_id: Course['id'], week: any): Promise<ApiResponse<Week>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/`, {
        method: "POST",
        body: JSON.stringify(week),
    })
    revalidateTag(`weeks:${course_id}`)
    return await response.json()
}

export async function updateWeek(course_id: Course['id'], week_id: string, week: any): Promise<ApiResponse<Week>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}`, {
        method: "PATCH",
        body: JSON.stringify(week),
    })
    revalidateTag(`weeks:${course_id}`)
    return await response.json()
}

export async function deleteWeek(course_id: Course['id'], week_id: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}`, {
        method: "DELETE",
    })
    revalidateTag(`weeks:${course_id}`)
    return await response.json()
}




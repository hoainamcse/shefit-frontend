import type { Circuit } from "@/models/circuits"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "@/models/response"

export async function getCircuits(course_id: string, week_id: string, day_id: string): Promise<ListResponse<Circuit>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days/${day_id}/circuits`, { next: { tags: ["circuits"] } })
    return await response.json()
}


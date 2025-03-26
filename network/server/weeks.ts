import type { Week } from "@/models/weeks"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "@/models/response"

export async function getWeeks(course_id: string): Promise<ListResponse<Week>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/`, { next: { tags: ["weeks"] } })
    return await response.json()
}

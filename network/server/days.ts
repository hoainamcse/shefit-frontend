import type { Day } from "@/models/days"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "@/models/response"

export async function getDays(course_id: string, week_id: string): Promise<ListResponse<Day>> {
    const response = await fetchData(`/v1/courses/${course_id}/video-classes/weeks/${week_id}/days`, { next: { tags: ["days"] } })
    return await response.json()
}

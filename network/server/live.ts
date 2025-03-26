import type { Live } from "@/models/live"
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse } from '@/models/response'

export async function getLives(courseId: string): Promise<ApiResponse<Live>> {
    const response = await fetchData(`/v1/courses/${courseId}/live-classes/`, {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}
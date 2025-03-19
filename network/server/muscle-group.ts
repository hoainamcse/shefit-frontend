import type { Muscle } from "@/models/muscle-group"
import { fetchData } from '../helpers/fetch-data'
import { ApiResponse, ListResponse } from '@/models/response'

export async function getMuscleGroups(): Promise<ListResponse<Muscle>> {
    const response = await fetchData('/v1/muscle-groups/', {
        next: {
            revalidate: 0,
            tags: ['muscle-groups'],
        },
    })
    return await response.json()
}


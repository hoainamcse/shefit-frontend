import type { Coach } from "@/models/coaches"
import type { ListResponse } from "@/models/response"
import { fetchData } from '../helpers/fetch-data';

export async function getListCoaches(): Promise<ListResponse<Coach>> {
    const response = await fetchData('/v1/coaches', {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}
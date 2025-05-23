import type { Coach } from "@/models/coaches"
import type { ListResponse } from "@/models/response"
import { fetchData } from '../helpers/fetch-data';

export async function getCoaches(): Promise<ListResponse<Coach>> {
    const response = await fetchData('/v1/coaches', {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch coaches data');
    }

    return response.json();
}
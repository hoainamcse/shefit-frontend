import type { Coach } from "@/models/coaches"
import type { ApiResponse, ListResponse } from "@/models/response"
import { fetchData } from '../helpers/fetch-data';

export async function getListCoaches(): Promise<ListResponse<Coach>> {
    const response = await fetchData('/v1/coaches', {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}


export async function getCoach(id: string): Promise<ApiResponse<Coach>> {
    const response = await fetchData(`/v1/coaches/${id}`, {
        next: {
            revalidate: 0,
        },
    })
    return await response.json()
}   


export async function createCoach(coach: any): Promise<ApiResponse<Coach>> {
    const response = await fetchData('/v1/coaches', {
        method: 'POST',
        body: JSON.stringify(coach),
    })
    return await response.json()
}

export async function updateCoach(id: string, coach: any): Promise<ApiResponse<Coach>> {
    const response = await fetchData(`/v1/coaches/${id}`, {
        method: 'PUT',
        body: JSON.stringify(coach),
    })
    return await response.json()
}


export async function deleteCoach(id: string): Promise<ApiResponse<any>> {
    const response = await fetchData(`/v1/coaches/${id}`, {
        method: 'DELETE',
    })
    return await response.json()
}
    
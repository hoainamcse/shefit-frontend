import type { Calorie } from '@/models/calorie'
import type { ListResponse } from '@/models/response'
import { fetchData } from '../helpers/fetch-data'

export const getCalories = async (): Promise<ListResponse<Calorie>> => {
    const response = await fetchData('/v1/calories', {
        method: 'GET',
    })
    return await response.json()
}
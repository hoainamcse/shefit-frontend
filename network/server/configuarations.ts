import { ConfigurationsResponse } from '@/models/configurations';
import { fetchData } from '../helpers/fetch-data';

export async function getConfigurations(type: string): Promise<ConfigurationsResponse> {
    const response = await fetchData(`/v1/configurations?type=${type}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data`);
    }

    return response.json();
}

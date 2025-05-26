import { ApiResponse } from '@/models/response';
import { Configuration, ConfigurationsResponse } from '@/models/configuration';
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

async function getConfiguration(configuration_id: number): Promise<ApiResponse<Configuration>> {
    const response = await fetchData(`/v1/configurations/${configuration_id}`, {
        method: 'GET',
    });

    return response.json();
}

async function updateConfiguration(configuration_id: number, configuration: Configuration): Promise<ApiResponse<Configuration>> {
    const response = await fetchData(`/v1/configurations/${configuration_id}`, {
        method: 'PUT',
        body: JSON.stringify(configuration),
    });

    return response.json();
}

export { getConfiguration, updateConfiguration };

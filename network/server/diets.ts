import { Diet } from "@/models/diets";
import { fetchData } from "../helpers/fetch-data";
import { ApiResponse, ListResponse } from "@/models/response";

export async function getDiets(query?: any): Promise<ListResponse<Diet>> {
    const searchParams = new URLSearchParams(query).toString()
    const response = await fetchData("/v1/diets/?" + searchParams);
    return await response.json();
}

export async function getDietById(id: number): Promise<ApiResponse<Diet>> {
    const response = await fetchData(`/v1/diets/${id}`);
    return await response.json();
}

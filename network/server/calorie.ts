import { fetchData } from "../helpers/fetch-data";
import { ApiResponse, ListResponse } from "@/models/response";
import { Calorie } from "@/models/calorie";

export async function getCalories(): Promise<ListResponse<Calorie>> {
    const response = await fetchData("/v1/calories/");
    return await response.json();
}

export async function getCalorieById(id: number): Promise<ApiResponse<Calorie>> {
    const response = await fetchData(`/v1/calories/${id}`);
    return await response.json();
}

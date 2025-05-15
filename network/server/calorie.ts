
'use server'

import { fetchData } from "../helpers/fetch-data";
import { ApiResponse, ListResponse } from "@/models/response";
import { Calorie } from "@/models/calorie";
import { fetchDataServer } from "../helpers/fetch-data-server";
import { revalidateTag } from "next/cache";

export async function getCalories(): Promise<ListResponse<Calorie>> {
    const response = await fetchData("/v1/calories/");
    return await response.json();
}

export async function getCalorieById(id: number): Promise<ApiResponse<Calorie>> {
    const response = await fetchData(`/v1/calories/${id}`);
    return await response.json();
}

export async function createCalorie(calorie: any): Promise<ApiResponse<Calorie>> {
    const response = await fetchDataServer(`/v1/calories`, {
        method: "POST",
        body: JSON.stringify(calorie),
        credentials: 'include',
    });
    revalidateTag("calories")
    return await response.json();
}

export async function updateCalorie(calorie: any, id: number): Promise<ApiResponse<Calorie>> {
    const response = await fetchDataServer(`/v1/calories/${id}`, {
        method: "PUT",
        body: JSON.stringify(calorie),
        credentials: 'include',
    });
    revalidateTag("calories")
    return await response.json();
}

export async function deleteCalorie(id: number): Promise<ApiResponse<Calorie>> {
    const response = await fetchDataServer(`/v1/calories/${id}`, {
        method: "DELETE",
        credentials: 'include',
    });
    revalidateTag("calories")
    return await response.json();
}

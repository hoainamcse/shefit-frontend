'use server'

import { Diet } from "@/models/diet-admin";
import { fetchData } from "../helpers/fetch-data";
import { ApiResponse, ListResponse } from "@/models/response";
import { revalidateTag } from "next/cache";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getDiets(): Promise<ListResponse<Diet>> {
    const response = await fetchData("/v1/diets/");
    return await response.json();
}

export async function getDietById(id: number): Promise<ApiResponse<Diet>> {
    const response = await fetchData(`/v1/diets/${id}`);
    return await response.json();
}

export async function createDiet(diets: any[]): Promise<ListResponse<Diet>> {
    const response = await fetchDataServer(`/v1/diets:bulkCreate`, {
        method: "POST",
        body: JSON.stringify({ diets }),
        credentials: 'include',
    });
    revalidateTag("diets")
    return await response.json();
}

export async function updateDiet(diet: any, id: number): Promise<ApiResponse<Diet>> {
    const response = await fetchDataServer(`/v1/diets/${id}`, {
        method: "PUT",
        body: JSON.stringify(diet),
        credentials: 'include',
    });
    revalidateTag("diets")
    return await response.json();
}

export async function deleteDiet(id: number[]): Promise<ListResponse<Diet>> {
    const response = await fetchDataServer(`/v1/diets:bulkDeleteByIds`, {
        method: "POST",
        body: JSON.stringify(id),
        credentials: 'include',
    });
    revalidateTag("diets")
    return await response.json();
}


import { MealIngredient } from "@/models/meal-ingredients"
import { fetchData } from "../helpers/fetch-data"
import { ListResponse } from "@/models/response"

export async function getMealIngredients(): Promise<ListResponse<MealIngredient>> {
    const response = await fetchData("/v1/meal-ingredients/", {
        next: {
            revalidate: 0,
            tags: ["meal-ingredients"],
        },
    })
    return await response.json()
}

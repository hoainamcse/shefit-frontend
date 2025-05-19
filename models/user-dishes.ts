type UserDish = {
    id?: number,
    user_id: number,
    dish_id: number,
    created_at: string,
    updated_at: string,
    dish: {
        id: number,
        name: string,
        image: string,
        protein: number,
        fat: number,
        carb: number,
        fiber: number,
        calories: number,
        protein_source: string[],
        vegetable: string[],
        starch: string[],
        spices: string[],
        others: string[],
        diet_id: number,
        description: string,
        created_at: string,
        updated_at: string
    }
}

export type { UserDish }
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
        nutrients: string,
        diet_id: number,
        description: string,
        created_at: string,
        updated_at: string
    }
}

export type { UserDish }
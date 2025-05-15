type UserCart = {
    id: number,
    user_id: number,
    cart: {
        id: number,
        user_name: string,
        username: string,
        is_signed_up: boolean,
        telephone_number: string,
        city: string,
        address: string,
        shipping_fee: number,
        total: number,
        payment_method: string,
        status: string,
        notes: string,
        product_variants: {
            id: number,
            product_variant_id: number,
            quantity: number,
            created_at: string,
            updated_at: string
        }[],
        created_at: string,
        updated_at: string
    },
    created_at: string,
    updated_at: string
}

export type { UserCart }

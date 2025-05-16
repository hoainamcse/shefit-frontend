import { ProductColor, ProductSize } from "./products"

export interface Cart {
    data: any
    id: number
    user_name: string
    telephone_number: string
    city: string
    address: string
    shipping_fee: number
    total: number
    payment_method: string
    status: string
    notes: string
    product_variants: {
        id: number
        product_id: number
        name: string
        image_urls: string[]
        color: ProductColor
        size: ProductSize
        price: number
        quantity: number
        in_stock: boolean
    }[]
    username: string
    is_signed_up: boolean
    created_at: string
    updated_at: string
}

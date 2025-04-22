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
        color: ProductColor
        size: ProductSize
        in_stock: boolean
    }[]
}

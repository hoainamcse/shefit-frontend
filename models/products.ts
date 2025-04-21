export type Product = {
    id: number
    name: string
    description: string
    price: number
    category_id: number
    image_urls: string
    variants: Variant[]
    features: string[]
    created_at: string
    updated_at: string
}

export type Variant = {
    id: number
    name: string
    price: number
    product_id: number
}

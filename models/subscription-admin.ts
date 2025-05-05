type Gift = {
    id: number
    name: string
    image: string
    created_at: string
    updated_at: string
}

type Price = {
    id: number
    price: number
    duration: number
}

type Subscription = {
    id: number
    name: string
    course_format: 'video' | 'live' | 'both'
    prices: Price[]
    gifts: Gift[]
    cover_image: string
    thumbnail_image: string
    description_1: string
    description_2: string
    created_at: string
    updated_at: string
}

export type { Subscription, Gift }

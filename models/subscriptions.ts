type Gift = {
    id: number
    name: string
    image: string
    created_at: string
    updated_at: string
}

type Subscription = {
    id: number
    name: string
    course_format: string
    duration: number
    price: number
    gifts: Gift[]
    cover_image: string
    thumbnail_image: string
    description_1: string
    description_2: string
    created_at: string
    updated_at: string
}

export type { Subscription }

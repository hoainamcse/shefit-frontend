import type { MealPlan } from "./meal-plan"

type Gift = {
    id: number
    name: string
    image: string
    month_count: string
    type: string
    created_at: string
    updated_at: string
}

type Subscription = {
    id: string
    name: string
    course_format: string
    course_ids: number[]
    duration: number
    price: number
    prices: {
        id: number
        duration: number
        price: number
    }[]
    gifts: Gift[]
    cover_image: string
    thumbnail_image: string
    description_1: string
    description_2: string
    created_at: string
    updated_at: string
    meal_plan_ids?: MealPlan['id'][]
}

export type { Subscription }

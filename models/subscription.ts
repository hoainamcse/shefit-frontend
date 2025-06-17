import type { Course } from './course'
import type { MealPlan } from './meal-plan'

type Gift = {
  id: number
  type: 'item' | 'membership_month'
  name: string
  image: string
  month_count: number
  created_at: string
  updated_at: string
}

type GiftPayload = Omit<Gift, 'id' | 'created_at' | 'updated_at'>

type SubscriptionPrice = {
  id: number
  duration: number
  price: number
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
    result_checkup: string
    meal_plan_ids?: MealPlan['id'][]
    meal_plan_description?: string
}

type SubscriptionPayload = Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'gifts'> & {
  gift_ids: Gift['id'][]
}

export type { Subscription, Gift, SubscriptionPrice }
export type { SubscriptionPayload, GiftPayload }

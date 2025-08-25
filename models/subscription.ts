import type { Course } from './course'
import type { MealPlan } from './meal-plan'

type Gift = {
  id: number
  type: 'item' | 'membership_plan'
  name: string
  image: string
  duration: number
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
  original_subscription_end_at?: string;
  id: number
  name: string
  course_format: string
  duration: number
  price: number
  prices: {
    id: number
    duration: number
    price: number
  }[]
  gifts: Gift[]
  assets: {
    thumbnail?: string
    mobile_cover?: string
    desktop_cover?: string
    youtube_cover?: string
    homepage_thumbnail?: string
  }
  meal_plan_ids: number[]
  course_ids: number[]
  description_homepage: string
  description_1: string
  description_2: string
  created_at: string
  updated_at: string
  result_checkup: string
  meal_plan_description?: string
  courses: Pick<Course, 'id' | 'course_name'>[]
  meal_plans: Pick<MealPlan, 'id' | 'title'>[]
  relationships: {
    courses: Pick<Course, 'id' | 'course_name'>[]
    meal_plans: Pick<MealPlan, 'id' | 'title'>[]
    gifts: Gift[]
  }
  display_order: number
}

type SubscriptionPayload = Omit<Subscription, 'id' | 'created_at' | 'updated_at' | 'gifts' | 'courses' | 'meal_plans' | 'relationships'> & {
  gift_ids: Gift['id'][]
  course_ids: Course['id'][]
  meal_plan_ids: MealPlan['id'][]
}

export type { Subscription, Gift, SubscriptionPrice }
export type { SubscriptionPayload, GiftPayload }

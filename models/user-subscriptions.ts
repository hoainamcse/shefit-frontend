import type { Coupon } from './coupon'
import type { Gift } from './subscription'

type UserSubscription = {
  id: number
  user_id: number
  course_format: 'both' | 'video' | 'live'
  status: 'active' | 'expired' | 'canceled' | 'pending'
  created_at: string
  updated_at: string
  subscription_start_at: string
  subscription_end_at: string
  order_number: string
  total_price: number
  coupon?: Coupon
  gift?: Gift
  subscription: {
    id: number
    courses: Array<{
      id: number
      course_name: string
    }>
    name: string
  }
  exercises: Array<{
    id: number
    name: string
  }>
  meal_plans: Array<{
    id: number
    title: string
  }>
  dishes: Array<{
    id: number
    name: string
  }>
}

type UserSubscriptionPayload = Omit<
  UserSubscription,
  'id' | 'created_at' | 'updated_at' | 'coupon' | 'gift' | 'subscription' | 'exercises' | 'meal_plans' | 'dishes'
> & {
  coupon_id: number | null
  gift_id: number | null
  subscription_id: number
  exercise_ids: number[]
  meal_plan_ids: number[]
  dish_ids: number[]
}

export type { UserSubscription, UserSubscriptionPayload }

import type { Gift, Subscription } from '@/models/subscription'
import { MealPlan } from './meal-plan'
import { Dish } from './dish'
import { Exercise } from './exercise'
import { Coupon } from './coupon'

type UserSubscription = {
  id?: number
  user_id: number
  subscription_id: number
  course_format: string
  coupon_id: number | null
  gift_id: number | null
  status: 'active' | 'expired' | 'canceled' | 'pending'
  subscription_start_at: string
  subscription_end_at: string
  order_number: string
  total_price: number
  exercise_ids: number[]
  meal_plan_ids: number[]
  dish_ids: number[]
}

type UserSubscriptionDetail = Omit<
  UserSubscription,
  'subscription_id' | 'coupon_id' | 'gift_id' | 'exercise_ids' | 'meal_plan_ids' | 'dish_ids'
> & {
  id: number
  coupon?: Coupon
  gift?: Gift
  subscription: {
    id: Subscription['id']
    name: string
    courses: { id: number; course_name: string }[]
  }
  exercises: Pick<Exercise, 'id' | 'name'>[]
  meal_plans: Pick<MealPlan, 'id' | 'title'>[]
  meal_plan_ids: number[]
  dishes: Pick<Dish, 'id' | 'name'>[]
}

export type { UserSubscription, UserSubscriptionDetail }

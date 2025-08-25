import type { Gift, Subscription } from '@/models/subscription'
import { MealPlan } from './meal-plan'
import { Dish } from './dish'
import { Exercise } from './exercise'

type UserSubscription = {
  id?: number,
  user_id: number,
  subscription_id: number,
  course_format: string,
  coupon_code: string,
  status: string,
  subscription_start_at: string,
  subscription_end_at: string,
  gift_id?: number,
  order_number: string,
  total_price: number,
  exercise_ids: number[],
  meal_plan_ids: number[],
  dish_ids: number[],
}


type UserSubscriptionDetail = Omit<UserSubscription,
  'subscription_id' | 'gift_id' | 'exercise_ids' | 'meal_plan_ids' | 'dish_ids'> & {
    id: number
    gifts: Gift
    subscription: {
      id: Subscription['id']
      subscription_start_at: string
      subscription_end_at: string
      courses: { id: number; course_name: string }[]
    }
    exercises: Pick<Exercise, 'id' | 'name'>[]
    meal_plans: Pick<MealPlan, 'id' | 'title'>[]
    meal_plan_ids: number[]
    dishes: Pick<Dish, 'id' | 'name'>[]
  }

export type { UserSubscription, UserSubscriptionDetail }

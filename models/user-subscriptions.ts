import type { Gift } from '@/models/subscription-admin'

type UserSubscription = {
    id?: number,
    user_id: number,
    subscription_id: number,
    plan_id?: number,
    course_format: string,
    coupon_code: string,
    status: string,
    subscription_start_at: string,
    subscription_end_at: string,
    gift_id?: number,
    order_number: string,
    total_price: number,
    course_ids: number[],
    exercise_ids: number[],
    meal_plan_ids: number[],
    dish_ids: number[],
}


 type UserSubscriptionDetail = Omit<UserSubscription,
  'gift_id' | 'course_ids' | 'exercise_ids' | 'meal_plan_ids' | 'dish_ids'> & {
  id: number
  gifts: Gift
  courses: { id: number; course_name: string }[]
  exercises: { id: number; name: string }[]
  meal_plans: { id: number; title: string }[]
  dishes: { id: number; name: string }[]
}

export type { UserSubscription, UserSubscriptionDetail }

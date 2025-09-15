import type { Coupon } from "./coupon"

type User = {
  id: number
  username: string
  fullname: string
  phone_number: string
  email: string
  province: string
  address: string
  provider: 'default' | 'google'
  provider_id: string | null
  role: 'admin' | 'normal_user' | 'sub_admin'
  enable_chatbot: boolean
  enable_chatbot_actions: boolean
  token_usage: number
  course_clicks_current_month: number
  meal_plan_clicks_current_month: number
  created_at: string
  updated_at: string
  subscriptions: Array<{
    coupon?: Coupon
    status: 'active' | 'expired' | 'canceled' | 'pending'
    subscription_start_at: string
    subscription_end_at: string
    subscription: {
      id: number
      courses: Array<{
        id: number
        course_name: string
      }>
      name: string
    }
  }>
}

export type { User }

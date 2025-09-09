import { Subscription } from './subscription'

type Coupon = {
  id: number
  code: string
  discount_type: 'percentage' | 'fixed_amount' | 'membership_plan'
  discount_value: number
  coupon_type: 'subscription' | 'ecommerce'
  usage_count: number
  max_usage: number | null
  subscriptions: Array<Pick<Subscription, 'id' | 'name'>>
}

type CouponPayload = Omit<Coupon, 'id' | 'usage_count' | 'subscriptions'> & {
  subscription_ids: number[]
}

export type { Coupon, CouponPayload }

type Coupon = {
  id: number
  code: string
  discount_type: 'percentage' | 'fixed_amount' | 'membership_plan'
  discount_value: number
  coupon_type: 'subscription' | 'ecommerce'
  usage_count: number
  max_usage: number | null
}

type CouponPayload = Omit<Coupon, 'id' | 'usage_count'>

export type { Coupon, CouponPayload }

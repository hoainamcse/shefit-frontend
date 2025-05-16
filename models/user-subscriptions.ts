
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
    total_price: number
}

export type { UserSubscription }

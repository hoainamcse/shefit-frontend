type GiftBase = {
    id: number;
    created_at: string;
    updated_at: string;
}

type GiftItem = GiftBase & {
    name: string;
    image: string;
    type: 'item';
}

type GiftMembershipMonth = GiftBase & {
    month_count: number;
    type: 'membership_month';
}

type Gift = GiftItem | GiftMembershipMonth;

type Price = {
    id: number
    price: number
    duration: number
}

type Subscription = {
    id: number
    name: string
    course_format: 'video' | 'live' | 'both'
    course_ids: number[]
    meal_plan_ids: number[]
    prices: Price[]
    gifts: Gift[]
    cover_image: string
    thumbnail_image: string
    description_1: string
    description_2: string
    result_checkup: string
    created_at: string
    updated_at: string
}

export type { Subscription, Gift }

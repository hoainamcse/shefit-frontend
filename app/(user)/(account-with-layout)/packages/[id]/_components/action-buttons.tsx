'use client'

import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Subscription } from '@/models/subscription'
import { useSession } from '@/hooks/use-session'
import { createUserSubscription, getUserSubscriptions } from '@/network/client/users'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ActionButtons({ subscription }: { subscription: Subscription }) {
  const { session } = useSession()
  const isFreeSubscription = subscription.prices.length > 0 && subscription.prices.every((price) => price.price === 0)

  const { data, isLoading, refetch } = useQuery({
    queryFn: () => (session ? getUserSubscriptions(session.userId) : Promise.resolve(null)),
    queryKey: ['user-subscriptions', session?.userId],
    enabled: !!session,
  })

  const isSubscribed = data?.data?.find((userSub) => userSub.subscription.id === subscription.id) || false

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => createUserSubscription(data, data.user_id),
    onSuccess: () => {
      refetch()
      toast.success('Đăng ký thành công!')
    },
    onError: (error) => {
      console.error('Error creating subscription:', error)
      toast.error('Đăng ký không thành công!')
    },
  })

  const handleChargeFree = async () => {
    if (!session) {
      toast.error('Bạn cần đăng nhập để thực hiện hành động này.')
      return
    }
    const now = new Date()
    const duration = subscription.prices[0].duration || 7
    const endDate = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000)
    mutate({
      user_id: session.userId,
      subscription_id: subscription.id,
      course_format: subscription.course_format,
      coupon_code: '',
      status: 'active',
      subscription_start_at: now.toISOString(),
      subscription_end_at: endDate.toISOString(),
      order_number: `ORDER-${Date.now()}`,
      total_price: 0,
    })
  }

  if (isLoading) {
    return (
      <Button className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] w-full px-5 mx-auto text-base" disabled>
        Đang tải...
      </Button>
    )
  }

  if (!isFreeSubscription && isSubscribed) {
    return (
      <Link href={`/packages/${subscription.id}/purchase`} className="mx-auto max-lg:w-full">
        <Button className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] max-md:w-full w-full px-5 mx-auto text-base">
          Gia hạn gói
        </Button>
      </Link>
    )
  }

  if (!isFreeSubscription && !isSubscribed) {
    return (
      <Link href={`/packages/${subscription.id}/purchase`} className="mx-auto max-lg:w-full">
        <Button className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] max-md:w-full w-full px-5 mx-auto text-base lg:text-lg">
          Mua gói
        </Button>
      </Link>
    )
  }

  if (isFreeSubscription && !isSubscribed) {
    return (
      <Button
        className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] max-md:w-full w-full px-5 mx-auto text-base"
        onClick={handleChargeFree}
        disabled={isPending}
      >
        {isPending ? 'Đang xử lý...' : 'Đăng ký miễn phí'}
      </Button>
    )
  }

  return null
}

'use client'

import type { Subscription } from '@/models/subscription'

import Link from 'next/link'
import { toast } from 'sonner'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { createUserSubscription, getUserSubscriptions } from '@/network/client/users'

export default function ActionButtons({ subscription, query }: { subscription: Subscription; query: string }) {
  const { session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [openLogin, setOpenLogin] = useState(false)
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
      setOpenLogin(true)
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

  // Navigate to login page
  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(pathname + query)}`)
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
      <Link href={`/packages/${subscription.id}/purchase${query}`} className="mx-auto max-lg:w-full">
        <Button className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] max-md:w-full w-full px-5 mx-auto text-base">
          Gia hạn gói
        </Button>
      </Link>
    )
  }

  if (!isFreeSubscription && !isSubscribed) {
    return (
      <Link href={`/packages/${subscription.id}/purchase${query}`} className="mx-auto max-lg:w-full">
        <Button className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] max-md:w-full w-full px-5 mx-auto text-base lg:text-lg">
          Mua gói
        </Button>
      </Link>
    )
  }

  if (isFreeSubscription && !isSubscribed) {
    return (
      <>
        <Button
          className="bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] max-md:w-full w-full px-5 mx-auto text-base"
          onClick={handleChargeFree}
          disabled={isPending}
        >
          {isPending ? 'Đang xử lý...' : 'Đăng ký miễn phí'}
        </Button>
        {/* Login Dialog */}
        <Dialog open={openLogin} onOpenChange={setOpenLogin}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center text-center gap-6">
              <p className="text-base">ĐĂNG NHẬP ĐỂ ĐĂNG KÝ MIỄN PHÍ</p>
              <div className="flex gap-4 justify-center w-full px-10">
                <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleLoginClick}>
                  Đăng nhập
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="lg:w-[570px] max-md:w-full w-full mx-auto">
      <Button className="bg-[#13D8A7] h-[56px] rounded-full w-full px-5 text-base" disabled>
        Gia hạn
      </Button>
      <p className="p-4 text-center text-muted-foreground">Không thể hạn gói tập miễn phí</p>
    </div>
  )
}

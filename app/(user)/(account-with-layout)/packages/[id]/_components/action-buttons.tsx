'use client'

import type { Subscription } from '@/models/subscription'

import { toast } from 'sonner'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { queryKeyUserSubscriptions } from '@/network/client/user-subscriptions'
import { createUserSubscription, getUserSubscriptions } from '@/network/client/users'

export default function ActionButtons({ subscription, query }: { subscription: Subscription; query: string }) {
  const { session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [openLogin, setOpenLogin] = useState(false)

  // Subscription properties
  const isFreeSubscription = subscription.prices.length > 0 && subscription.prices.every((price) => price.price === 0)
  const buttonBaseClass =
    'bg-[#13D8A7] h-[56px] rounded-full lg:w-[570px] max-lg:w-full w-full px-5 mx-auto text-base lg:text-lg'

  // Get user subscriptions
  const { data, refetch } = useQuery({
    queryKey: [queryKeyUserSubscriptions, session?.userId],
    queryFn: () => getUserSubscriptions(session?.userId!),
    enabled: !!session?.userId,
  })

  const isSubscribed = data?.data?.find((userSub) => userSub.subscription.id === subscription.id) || false

  // Mutation for creating subscriptions
  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => createUserSubscription(data, data.user_id),
    onSuccess: () => {
      refetch()
      toast.success('Kích hoạt thành công!')
      router.push('/account/packages')
    },
    onError: (error) => {
      console.error('Error creating subscription:', error)
      toast.error('Kích hoạt không thành công!')
    },
  })

  // Check user authentication and prompt login if needed
  const ensureAuthenticated = (callback: () => void) => {
    if (!session) {
      setOpenLogin(true)
      return false
    }
    callback()
    return true
  }

  // Navigate to login page
  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(pathname + query)}`)
  }

  // Process free subscription
  const activateFreeSubscription = () => {
    if (!session) return

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

  // Handle subscription purchase/activation
  const handleSubscription = () => {
    ensureAuthenticated(() => {
      if (isFreeSubscription) {
        activateFreeSubscription()
      } else {
        router.push(`/packages/${subscription.id}/purchase${query}`)
      }
    })
  }

  // Render appropriate button based on subscription state
  const renderActionButton = () => {
    if (isSubscribed) {
      return (
        <>
          <Button disabled={isFreeSubscription} className={buttonBaseClass} onClick={handleSubscription}>
            Gia hạn
          </Button>
          {isFreeSubscription && (
            <p className="p-4 text-center text-muted-foreground">Gói tập miễn phí chỉ được kích hoạt một lần</p>
          )}
        </>
      )
    }

    return (
      <Button className={buttonBaseClass} disabled={isPending} onClick={handleSubscription}>
        {isFreeSubscription ? 'Kích hoạt miễn phí' : 'Mua gói'}
      </Button>
    )
  }

  return (
    <>
      {renderActionButton()}

      {/* Login Dialog */}
      <Dialog open={openLogin} onOpenChange={setOpenLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">ĐĂNG NHẬP ĐỂ {isFreeSubscription ? 'KÍCH HOẠT MIỄN PHÍ' : 'MUA GÓI'}</p>
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

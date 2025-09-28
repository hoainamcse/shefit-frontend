'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { CardDish } from '@/components/cards/card-dish'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { getDiet, queryKeyDiets } from '@/network/client/diets'
import { getDishes, queryKeyDishes } from '@/network/client/dishes'
import { isActiveSubscription } from '@/utils/business'
import { getUserSubscriptions } from '@/network/client/users'
import { queryKeyUserSubscriptions } from '@/network/client/user-subscriptions'

export default function DietDishesPage() {
  const searchParams = useSearchParams()
  const query = searchParams ? `?${searchParams.toString()}` : ''
  const dietId = searchParams.get('diet_id')
  const back = searchParams.get('back')

  const router = useRouter()
  const { session } = useSession()
  const [openLogin, setOpenLogin] = useState(false)
  const [openBuyPackage, setOpenBuyPackage] = useState(false)

  const [dietQuery, dietDishesQuery, userSubscriptionsQuery] = useQueries({
    queries: [
      {
        queryKey: [queryKeyDiets, dietId],
        queryFn: () => getDiet(Number(dietId)),
        enabled: !!dietId,
      },
      {
        queryKey: [queryKeyDishes, dietId],
        queryFn: () => getDishes({ diet_id: Number(dietId) }),
        enabled: !!dietId,
      },
      {
        queryKey: [queryKeyUserSubscriptions, session?.userId],
        queryFn: () => getUserSubscriptions(session?.userId!),
        enabled: !!session?.userId,
      },
    ],
  })

  const diet = dietQuery.data?.data
  const dietDishes = dietDishesQuery.data?.data || []
  const userSubscriptions = userSubscriptionsQuery.data?.data || []

  const isAccessed = userSubscriptions.some((sub) => isActiveSubscription(sub.status, sub.subscription_end_at)) || false

  if (dietQuery.isLoading || dietDishesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!dietId || !diet) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Chế độ ăn không tồn tại.</p>
      </div>
    )
  }

  const handleStartDish = (dishId: number) => {
    if (!session) {
      setOpenLogin(true)
      return
    }

    if (!isAccessed) {
      setOpenBuyPackage(true)
      return
    }

    router.push(`/dishes/${dishId}${query}`)
  }

  // Navigate to login page
  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(`/dishes${query}`)}`)
  }

  // Navigate to packages page with course ID
  const handleBuyPackageClick = () => {
    router.push(`/packages?redirect=${encodeURIComponent(`/dishes${query}`)}`)
  }

  return (
    <>
      <div className="flex flex-col gap-10 p-4 mt-6 md:mt-10 lg:mt-[76px]">
        <div>
          <Link
            href={back || `/gallery#dishes`}
            className="flex cursor-pointer items-center gap-2.5 font-semibold lg:hidden md:mb-7 mb-2"
          >
            <div className="w-6 h-6 pt-1 flex justify-center">
              <BackIconBlack />
            </div>
            Quay về
          </Link>
          <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-4 sm:mb-6 md:mb-10 lg:mb-[60px] xl:mb-[90px]">
            <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
              Các món thuộc chế độ {diet.name}
            </div>
            <p className="text-[#737373] text-sm lg:text-lg">{diet.description}</p>
          </div>
          <div className="grid grid-cols-3 sm:gap-5 gap-4">
            {dietDishes.map((dish) => (
              <CardDish key={dish.id} data={dish} onClick={() => handleStartDish(dish.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* Buy Package Dialog */}
      <Dialog open={openBuyPackage} onOpenChange={setOpenBuyPackage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">MUA GÓI MEMBER ĐỂ TRUY CẬP MÓN ĂN</p>
            <div className="w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleBuyPackageClick}>
                Mua gói Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={openLogin} onOpenChange={setOpenLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">ĐĂNG NHẬP ĐỂ TRUY CẬP MÓN ĂN</p>
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

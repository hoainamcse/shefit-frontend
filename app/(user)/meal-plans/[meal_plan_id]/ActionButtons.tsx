'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { addFavouriteMealPlan, getFavouriteMealPlans } from '@/network/client/user-favourites'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getUserSubscriptions } from '@/network/client/users'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'

interface ActionButtonsProps {
  mealPlanId: number
}

export default function ActionButtons({ mealPlanId }: ActionButtonsProps) {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [showLoginDialogSave, setShowLoginDialogSave] = useState(false)
  const [isInFavorites, setIsInFavorites] = useState(false)
  const [hasValidSubscription, setHasValidSubscription] = useState(false)
  const [isCheckingData, setIsCheckingData] = useState(true)

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setShowLoginDialog(false)
    setShowSubscribeDialog(false)
    redirectToAccount('buy-package')
  }

  const isSubscriptionValid = (subscriptionEndAt: string): boolean => {
    if (!subscriptionEndAt) return false
    const endDate = new Date(subscriptionEndAt)
    const currentDate = new Date()
    return endDate > currentDate
  }

  useEffect(() => {
    const checkMealPlanData = async () => {
      if (!session) {
        setIsCheckingData(false)
        return
      }

      try {
        const favorites = await getFavouriteMealPlans(session.userId.toString())
        const inFavorites = favorites.data?.some((favorite) => {
          return Number(favorite.meal_plan?.id) === Number(mealPlanId)
        })
        setIsInFavorites(inFavorites || false)

        const subscriptions = await getUserSubscriptions(session.userId.toString())
        const hasValidSub = subscriptions.data?.some((subscription) => {
          return subscription.subscription_end_at && isSubscriptionValid(subscription.subscription_end_at)
        })
        setHasValidSubscription(hasValidSub || false)
      } catch (error) {
        console.error('Error checking meal plan data:', error)
        setIsInFavorites(false)
        setHasValidSubscription(false)
      } finally {
        setIsCheckingData(false)
      }
    }

    checkMealPlanData()
  }, [session, mealPlanId])

  const handleSaveMealPlan = async (mealPlanId: number) => {
    if (!session) {
      setShowLoginDialogSave(true)
      return
    }

    try {
      await addFavouriteMealPlan(session.userId, mealPlanId.toString())
      toast.success('Đã lưu thực đơn thành công!')
      setIsInFavorites(true)
    } catch (error) {
      console.error('Error saving meal plan:', error)
      toast.error('Có lỗi xảy ra khi lưu thực đơn!')
    }
  }

  const handleStartClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!session) {
      setShowLoginDialog(true)
      return
    }

    try {
      const subscriptions = await getUserSubscriptions(session.userId.toString())
      const hasValidSub = subscriptions.data?.some((subscription) => {
        return subscription.subscription_end_at && isSubscriptionValid(subscription.subscription_end_at)
      })

      const favorites = await getFavouriteMealPlans(session.userId.toString())
      const inFavorites = favorites.data?.some((favorite) => {
        return Number(favorite.meal_plan?.id) === Number(mealPlanId)
      })

      if (hasValidSub || inFavorites) {
        window.location.href = `/meal-plans/${mealPlanId}/detail`
      } else {
        setShowSubscribeDialog(true)
      }
    } catch (error) {
      console.error('Error checking meal plan access:', error)
      setShowSubscribeDialog(true)
    }
  }

  return (
    <>
      <div className="lg:gap-5 gap-3 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
        <div className={isInFavorites ? 'w-full' : 'w-1/2'}>
          <div className="w-full block" onClick={handleStartClick}>
            <Button className="w-full rounded-full text-lg bg-[#13D8A7] text-white hover:bg-[#11c296] h-14">
              Bắt đầu
            </Button>
          </div>
        </div>

        {!isCheckingData && !isInFavorites && (
          <div className="w-1/2">
            <Button
              onClick={() => handleSaveMealPlan(mealPlanId)}
              className="w-full rounded-full text-lg bg-white text-[#13D8A7] h-14 border-2 border-[#13D8A7] hover:bg-gray-50"
            >
              Lưu
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-sm">ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP THỰC ĐƠN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleBuyPackageClick}>
                  Mua gói Member
                </Button>
              </div>
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleLoginClick}>
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSubscribeDialog} onOpenChange={setShowSubscribeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">HÃY MUA GÓI ĐỂ TRUY CẬP THỰC ĐƠN</p>
            <div className="w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleBuyPackageClick}>
                Mua gói Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLoginDialogSave} onOpenChange={setShowLoginDialogSave}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">ĐĂNG NHẬP ĐỂ LƯU THỰC ĐƠN</p>
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

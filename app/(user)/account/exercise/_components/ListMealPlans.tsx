'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSubscription } from './SubscriptionContext'
import { useSession } from '@/hooks/use-session'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { getMealPlans, getMealPlan } from '@/network/server/meal-plans'
import { MealPlan } from '@/models/meal-plan'
import { useEffect } from 'react'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { getFavouriteMealPlans } from '@/network/client/user-favourites'
import { FavouriteMealPlan } from '@/models/favourite'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ListMealPlans() {
  const { session } = useSession()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const [filteredMealPlans, setFilteredMealPlans] = useState<MealPlan[]>([])
  const [favoriteMealPlans, setFavoriteMealPlans] = useState<FavouriteMealPlan[]>([])
  const [combinedMealPlans, setCombinedMealPlans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchAndFilterMealPlans = async () => {
      if (!selectedSubscription?.meal_plans?.length) {
        setFilteredMealPlans([])
      } else {
        try {
          setIsLoading(true)
          const response = await getMealPlans()

          if (response?.data) {
            const subscriptionMealPlanIds = selectedSubscription.meal_plans.map((mp: any) =>
              typeof mp === 'object' ? mp.id : mp
            )

            const filtered = response.data.filter((mealPlan: MealPlan) => subscriptionMealPlanIds.includes(mealPlan.id))

            setFilteredMealPlans(filtered)
          }
        } catch (error) {
          console.error('Error fetching meal plans:', error)
        }
      }
    }

    fetchAndFilterMealPlans()
  }, [selectedSubscription?.meal_plans])

  useEffect(() => {
    const fetchFavoriteMealPlans = async () => {
      if (!session?.userId) {
        return
      }

      try {
        const response = await getFavouriteMealPlans(session.userId)

        if (!response.data || response.data.length === 0) {
          setFavoriteMealPlans([])
          return
        }

        const favoriteMealPlans = response.data
          .map((fav: any) => ({
            id: fav.meal_plan?.id || fav.meal_plan_id,
            meal_plan_id: fav.meal_plan_id || fav.meal_plan?.id,
          }))
          .filter((fav: any) => fav.meal_plan_id)

        const mealPlanPromises = favoriteMealPlans.map(async (fav: any) => {
          try {
            const mealPlanId = typeof fav.meal_plan_id === 'string' ? parseInt(fav.meal_plan_id, 10) : fav.meal_plan_id

            const response = await getMealPlan(mealPlanId.toString())
            if (response && response.status === 'success' && response.data) {
              return {
                user_id: Number(session.userId),
                meal_plan: response.data,
                title: response.data.title,
                subtitle: response.data.subtitle,
                chef_name: response.data.chef_name,
                image: response.data.image,
                number_of_days: response.data.number_of_days,
              }
            }
            return null
          } catch (error) {
            console.error(`Error fetching meal plan ${fav.meal_plan_id}:`, error)
            return null
          }
        })

        const mealPlans = (await Promise.all(mealPlanPromises)).filter(Boolean)
        setFavoriteMealPlans(mealPlans as FavouriteMealPlan[])
      } catch (error) {
        console.error('Error in fetchFavoriteMealPlans:', error)
      }
    }

    fetchFavoriteMealPlans()
  }, [session?.userId])

  const isFavouriteMealPlan = (obj: any): obj is FavouriteMealPlan => {
    return obj && 'meal_plan' in obj && obj.meal_plan !== null && typeof obj.meal_plan === 'object'
  }

  const isMealPlan = (obj: any): obj is MealPlan => {
    return obj && 'id' in obj && !('meal_plan' in obj)
  }

  const getMealPlanId = (mealPlan: FavouriteMealPlan | MealPlan): number | undefined => {
    if (isFavouriteMealPlan(mealPlan)) {
      return mealPlan.meal_plan?.id
    } else if (isMealPlan(mealPlan)) {
      return mealPlan.id
    }
    return undefined
  }

  useEffect(() => {
    setIsLoading(true)

    const mealPlansMap = new Map()

    filteredMealPlans.forEach((mealPlan) => {
      mealPlansMap.set(mealPlan.id, mealPlan)
    })

    favoriteMealPlans.forEach((mealPlan) => {
      const mealPlanId = getMealPlanId(mealPlan)
      if (mealPlanId !== undefined && !mealPlansMap.has(mealPlanId)) {
        mealPlansMap.set(mealPlanId, mealPlan)
      }
    })

    const combined = Array.from(mealPlansMap.values())
    setCombinedMealPlans(combined)
    setIsLoading(false)
  }, [filteredMealPlans, favoriteMealPlans])
  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('buy-package')
  }
  if (!session) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm thực đơn</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">VUI LÒNG ĐĂNG NHẬP VÀ MUA GÓI</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleBuyPackageClick}>
                  Mua gói
                </Button>
              </div>
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleLoginClick}>
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!selectedSubscription) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-500 mb-4">Vui lòng chọn gói đăng ký để xem thực đơn</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
      </div>
    )
  }

  if (combinedMealPlans.length === 0) {
    return (
      <Link href="/meal-plans">
        <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm thực đơn</Button>
      </Link>
    )
  }

  return (
    <div>
      <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center"></DialogTitle>
            <DialogDescription className="text-center text-lg text-[#737373]">
              GÓI ĐÃ HẾT HẠN HÃY GIA HẠN GÓI ĐỂ TIẾP TỤC TRUY CẬP
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="default"
             className="bg-[#13D8A7] hover:bg-[#0fb88e] text-white rounded-full w-full h-14 text-lg"
              onClick={() => {
                setRenewDialogOpen(false)
                if (selectedSubscription?.subscription?.id) {
                  router.push(`/packages/detail/${selectedSubscription.subscription.id}`)
                }
              }}
            >
              Gia hạn gói
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
        {combinedMealPlans.map((mealPlan) => {
          const mealPlanId = getMealPlanId(mealPlan as FavouriteMealPlan | MealPlan)
          return mealPlanId ? (
            <div key={mealPlanId} className="group">
              <Link
                href={selectedSubscription?.status === 'expired' ? '#' : `/meal-plans/${mealPlanId}`}
                className={selectedSubscription?.status === 'expired' ? 'cursor-not-allowed' : ''}
                onClick={
                  selectedSubscription?.status === 'expired'
                    ? (e) => {
                        e.preventDefault()
                        setRenewDialogOpen(true)
                      }
                    : undefined
                }
              >
                <div>
                  <div className="relative group">
                    {selectedSubscription?.status === 'expired' && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50 rounded-xl">
                        <Lock className="text-white w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 z-10">
                      <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                    </div>
                    <img
                      src={mealPlan.image}
                      alt={mealPlan.title}
                      className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-medium">{mealPlan.title}</p>
                  <p className="text-[#737373]">{mealPlan.subtitle}</p>
                  <p className="text-[#737373]">
                    Chef {mealPlan.chef_name} - {mealPlan.number_of_days} ngày
                  </p>
                </div>
              </Link>
            </div>
          ) : null
        })}
      </div>
      <div className="mt-6">
        <Link href="/meal-plans">
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm thực đơn</Button>
        </Link>
      </div>
    </div>
  )
}

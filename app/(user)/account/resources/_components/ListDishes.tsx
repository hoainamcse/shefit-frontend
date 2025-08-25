'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { getDishes, getDish } from '@/network/server/dishes'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import type { Dish } from '@/models/dish'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { getFavouriteDishes, removeFavouriteDish } from '@/network/client/user-favourites'
import { FavouriteDish } from '@/models/favourite'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DeleteIconMini } from '@/components/icons/DeleteIconMini'
import { toast } from 'sonner'

export default function ListDishes() {
  const { session } = useSession()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([])
  const [favoriteDishes, setFavoriteDishes] = useState<FavouriteDish[]>([])
  const [combinedDishes, setCombinedDishes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const isSubscriptionExpired = useMemo(() => {
    if (!selectedSubscription?.subscription_end_at) return true
    const endDate = new Date(selectedSubscription.subscription_end_at)
    return new Date() > endDate
  }, [selectedSubscription])

  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('packages')
  }

  const handleDeleteFavouriteDish = async (dishId: number, dishTitle: string) => {
    if (!session?.userId) return

    try {
      await removeFavouriteDish(session.userId, dishId)

      setCombinedDishes((prev) => prev.filter((item) => item.id !== dishId))

      setFavoriteDishes((prev) => prev.filter((item) => item.dish.id !== dishId))

      toast.success(`Đã xóa ${dishTitle} khỏi danh sách`)
    } catch (error) {
      console.error('Error deleting favourite dish:', error)
      toast.error('Có lỗi xảy ra khi xóa món ăn')
    }
  }

  useEffect(() => {
    const fetchAndFilterDishes = async () => {
      if (!selectedSubscription?.dishes?.length) {
        setFilteredDishes([])
      } else {
        try {
          setIsLoading(true)
          const response = await getDishes()

          if (response?.data) {
            const subscriptionDishIds = selectedSubscription.dishes.map((mp: any) =>
              typeof mp === 'object' ? mp.id : mp
            )

            const filtered = response.data.filter((dish: any) => subscriptionDishIds.includes(dish.id))
            setFilteredDishes(filtered)
          }
        } catch (error) {
          console.error('Error fetching dishes:', error)
        }
      }
    }

    fetchAndFilterDishes()
  }, [selectedSubscription?.dishes])

  useEffect(() => {
    const fetchFavouriteDishes = async () => {
      if (!session?.userId) {
        return
      }

      try {
        const response = await getFavouriteDishes(session.userId)

        if (!response.data || response.data.length === 0) {
          setFavoriteDishes([])
          return
        }

        const favoriteDishes = response.data
          .map((fav: any) => ({
            id: fav.dish?.id || fav.dish_id,
            dish_id: fav.dish_id || fav.dish?.id,
          }))
          .filter((fav: any) => fav.dish_id)

        const dishPromises = favoriteDishes.map(async (fav: any) => {
          try {
            const dishId = typeof fav.dish_id === 'string' ? parseInt(fav.dish_id, 10) : fav.dish_id

            const response = await getDish(dishId.toString())
            if (response && response.status === 'success' && response.data) {
              return {
                id: dishId,
                user_id: session.userId,
                dish: response.data,
                name: response.data.name,
                title: response.data.name,
                image: response.data.image,
                diet: response.data.diet,
              }
            }
            return null
          } catch (error) {
            console.error(`Error fetching dish ${fav.dish_id}:`, error)
            return null
          }
        })

        const dishes = (await Promise.all(dishPromises)).filter(Boolean)
        setFavoriteDishes(dishes as FavouriteDish[])
      } catch (error) {
        console.error('Error in fetchFavouriteDishes:', error)
      }
    }

    fetchFavouriteDishes()
  }, [session?.userId])

  useEffect(() => {
    setIsLoading(true)
    const dishesMap = new Map()
    filteredDishes.forEach((dish) => {
      dishesMap.set(dish.id, dish)
    })
    favoriteDishes.forEach((dish) => {
      if (!dishesMap.has(dish.id)) {
        dishesMap.set(dish.id, dish)
      }
    })

    const combined = Array.from(dishesMap.values())
    setCombinedDishes(combined)
    setIsLoading(false)
  }, [filteredDishes, favoriteDishes])

  if (!session) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 mt-6 text-sm lg:text-lg">
            Thêm món ăn
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-lg lg:text-xl font-bold">
              VUI LÒNG ĐĂNG NHẬP VÀ MUA GÓI
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-sm lg:text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg" onClick={handleBuyPackageClick}>
                  Mua gói
                </Button>
              </div>
              <div className="flex-1">
                <Button className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg" onClick={handleLoginClick}>
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
      </div>
    )
  }

  if (combinedDishes.length === 0) {
    return (
      <Link href="/gallery#dishes">
        <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 text-sm lg:text-lg">Thêm món ăn</Button>
      </Link>
    )
  }

  return (
    <div>
      <Dialog open={renewDialogOpen} onOpenChange={setRenewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center"></DialogTitle>
            <DialogDescription className="text-center text-sm lg:text-lg text-[#737373]">
              GÓI ĐÃ HẾT HẠN HÃY GIA HẠN GÓI ĐỂ TIẾP TỤC TRUY CẬP
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="default"
              className="bg-[#13D8A7] hover:bg-[#0fb88e] text-white rounded-full w-full h-14 text-sm lg:text-lg"
              onClick={() => {
                setRenewDialogOpen(false)
                if (selectedSubscription?.subscription?.id) {
                  router.push(`/packages/${selectedSubscription.subscription.id}`)
                }
              }}
            >
              Gia hạn gói
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-3 lg:gap-6 gap-4 mx-auto mt-6 text-sm lg:text-lg">
        {combinedDishes.map((dish) => (
          <div key={dish.id} className="group">
            <Link
              href={isSubscriptionExpired ? '#' : `/gallery/dishes/${dish.id}?diet_id=${dish.diet?.id || dish.diet_id}&back=%2Faccount%2Fresources`}
              onClick={
                isSubscriptionExpired
                  ? (e) => {
                      e.preventDefault()
                      setRenewDialogOpen(true)
                    }
                  : undefined
              }
            >
              <div>
                <div className="relative group lg:max-w-[585px]">
                  {isSubscriptionExpired && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50 rounded-xl">
                      <Lock className="text-white w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute lg:top-4 lg:right-4 z-10 top-2 right-2">
                    <div
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteFavouriteDish(dish.id, dish.title)
                      }}
                      className="lg:block hidden"
                    >
                      <DeleteIcon
                        className="text-white hover:text-red-500 transition-colors duration-300"
                        onClick={() => handleDeleteFavouriteDish(dish.id, dish.title)}
                      />
                    </div>
                    <div
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDeleteFavouriteDish(dish.id, dish.title)
                      }}
                      className="lg:hidden block"
                    >
                      <DeleteIconMini
                        className="text-white hover:text-red-500 transition-colors duration-300"
                        onClick={() => handleDeleteFavouriteDish(dish.id, dish.title)}
                      />
                    </div>
                  </div>
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="md:aspect-[585/373] aspect-square object-cover rounded-xl mb-4 w-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
                <p className="font-medium text-sm lg:text-lg">{dish.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/gallery#dishes">
          <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 text-sm lg:text-lg lg:mt-12 mt-6">
            Thêm món ăn
          </Button>
        </Link>
      </div>
    </div>
  )
}

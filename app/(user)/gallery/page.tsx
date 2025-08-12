'use client'

import Link from 'next/link'
import { getMuscleGroups } from '@/network/client/muscle-groups'
import { getDiets } from '@/network/server/diets'
import { useState, useEffect } from 'react'
import { ListResponse } from '@/models/response'
import { MuscleGroup } from '@/models/muscle-group'
import { Diet } from '@/models/diet'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { getUserSubscriptions } from '@/network/client/users'

export const dynamic = 'force-dynamic'

export default function Gallery() {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const [dialogOpen, setDialogOpen] = useState<string | false>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMuscleGroupsLoading, setIsMuscleGroupsLoading] = useState(true)
  const [isDietsLoading, setIsDietsLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true)
  const [muscleGroupsData, setMuscleGroupsData] = useState<ListResponse<MuscleGroup>>({
    status: '',
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })
  const [dietsData, setDietsData] = useState<ListResponse<Diet>>({
    status: '',
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })

  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('buy-package')
  }

  useEffect(() => {
    const checkSubscription = async () => {
      if (!session) {
        setHasActiveSubscription(false)
        setIsCheckingSubscription(false)
        return
      }

      try {
        const subscriptions = await getUserSubscriptions(session.userId.toString())
        const currentDate = new Date()
        const hasValidSubscription = subscriptions.data?.some((subscription) => {
          if (!subscription.subscription_end_at) return false
          const endDate = new Date(subscription.subscription_end_at)
          return currentDate <= endDate
        })

        setHasActiveSubscription(hasValidSubscription || false)
      } catch (error) {
        console.error('Error checking subscription:', error)
        setHasActiveSubscription(false)
      } finally {
        setIsCheckingSubscription(false)
      }
    }

    checkSubscription()
  }, [session])

  useEffect(() => {
    setIsLoading(isMuscleGroupsLoading || isDietsLoading)
  }, [isMuscleGroupsLoading, isDietsLoading])

  useEffect(() => {
    if (!isLoading && !isCheckingSubscription) {
      const timer = setTimeout(() => {
        if (window.location.hash === '#dishes') {
          const element = document.getElementById('dishes')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isLoading, isCheckingSubscription])

  useEffect(() => {
    async function fetchMuscleGroups() {
      try {
        setIsMuscleGroupsLoading(true)
        const data = await getMuscleGroups()
        setMuscleGroupsData(data)
      } catch (error) {
        console.error('Error fetching muscle groups:', error)
      } finally {
        setIsMuscleGroupsLoading(false)
      }
    }

    fetchMuscleGroups()
  }, [])

  useEffect(() => {
    async function fetchDiets() {
      try {
        setIsDietsLoading(true)
        const data = await getDiets()
        setDietsData(data)
      } catch (error) {
        console.error('Error fetching diets:', error)
      } finally {
        setIsDietsLoading(false)
      }
    }

    fetchDiets()
  }, [])

  return (
    <div className="flex flex-col gap-10 sm:gap-16 lg:gap-[90px] pt-10 lg:pt-16 xl:pt-[93px]">
      <div>
        <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-4 sm:mb-10 lg:mb-16 xl:mb-[90px]">
          <div className="font-[family-name:var(--font-roboto-condensed)] text-ring text-2xl lg:text-4xl font-semibold">
            Bài tập theo nhóm cơ
          </div>
          <p className="text-[#737373] text-sm lg:text-lg">
            Xem video hướng dẫn chi tiết 1000+ bài đốt mỡ và cắt nét cơ theo từng vùng hình thể nữ giới
          </p>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-4 sm:gap-5 gap-4">
          {muscleGroupsData.data.map((muscleGroup) =>
            session && hasActiveSubscription && !isCheckingSubscription ? (
              <Link href={`/gallery/muscle/${muscleGroup.id}`} key={muscleGroup.id}>
                <div key={`menu-${muscleGroup.id}`} className="overflow-hidden">
                  <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square">
                    <img
                      src={muscleGroup.image ?? undefined}
                      alt=""
                      className="object-cover rounded-[8px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <p className="font-medium lg:font-bold text-sm lg:text-lg">{muscleGroup.name}</p>
                </div>
              </Link>
            ) : (
              <div key={muscleGroup.id}>
                <Dialog
                  open={dialogOpen === `muscle-${muscleGroup.id}`}
                  onOpenChange={(open) => {
                    if (!open) setDialogOpen(false)
                  }}
                >
                  <DialogTrigger asChild>
                    <div
                      key={`menu-${muscleGroup.id}`}
                      className="text-lg cursor-pointer"
                      onClick={() => setDialogOpen(`muscle-${muscleGroup.id}`)}
                    >
                      <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square">
                        <img
                          src={muscleGroup.image ?? undefined}
                          alt=""
                          className="object-cover rounded-[8px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                        />
                      </div>
                      <p className="font-medium lg:font-bold text-sm lg:text-lg">{muscleGroup.name}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center text-center gap-6">
                      <p className="text-sm lg:text-lg">
                        {session
                          ? 'MUA GÓI ĐỂ TRUY CẬP BÀI TẬP & MÓN ĂN'
                          : 'ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP BÀI TẬP & MÓN ĂN'}
                      </p>
                      <div className="flex gap-4 justify-center w-full px-10">
                        <div className="flex-1">
                          <Button
                            className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg"
                            onClick={handleBuyPackageClick}
                          >
                            Mua gói Member
                          </Button>
                        </div>
                        {!session && (
                          <div className="flex-1">
                            <Button
                              className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg"
                              onClick={handleLoginClick}
                            >
                              Đăng nhập
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )
          )}
        </div>
      </div>
      <div>
        <div
          id="dishes"
          className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-4 sm:mb-10 lg:mb-16 xl:mb-[90px]"
        >
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
            Món theo chế độ ăn
          </div>
          <p className="text-[#737373] text-sm lg:text-lg">
            Khám phá 500+ món ăn theo các chế độ ăn khác nhau phù hợp nhất với mục tiêu của bạn.
          </p>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-4 sm:gap-5 gap-4">
          {dietsData.data?.map((diet) =>
            session && hasActiveSubscription && !isCheckingSubscription ? (
              <Link href={`/gallery/meal/${diet.id}`} key={diet.id}>
                <div key={`menu-${diet.id}`} className="text-lg overflow-hidden">
                  <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square">
                    <img
                      src={diet.image}
                      alt=""
                      className="object-cover rounded-[8px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                    />
                  </div>
                  <p className="font-medium lg:font-bold text-sm lg:text-lg">{diet.name}</p>
                </div>
              </Link>
            ) : (
              <div key={diet.id}>
                <Dialog
                  open={dialogOpen === `diet-${diet.id}`}
                  onOpenChange={(open) => {
                    if (!open) setDialogOpen(false)
                  }}
                >
                  <DialogTrigger asChild>
                    <div
                      key={`menu-${diet.id}`}
                      className="text-lg cursor-pointer"
                      onClick={() => setDialogOpen(`diet-${diet.id}`)}
                    >
                      <div className="relative group mb-2 md:mb-3 lg:mb-5 aspect-square">
                        <img
                          src={diet.image}
                          alt=""
                          className="object-cover rounded-[8px] w-full h-full brightness-100 group-hover:brightness-110 transition-all duration-300"
                        />
                      </div>
                      <p className="font-medium lg:font-bold text-sm lg:text-lg">{diet.name}</p>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center text-center gap-6">
                      <p className="text-sm lg:text-lg">
                        {session
                          ? 'MUA GÓI ĐỂ TRUY CẬP BÀI TẬP & MÓN ĂN'
                          : 'ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP BÀI TẬP & MÓN ĂN'}
                      </p>
                      <div className="flex gap-4 justify-center w-full px-10">
                        <div className="flex-1">
                          <Button
                            className="bg-[#13D8A7] rounded-full w-full text-base"
                            onClick={handleBuyPackageClick}
                          >
                            Mua gói Member
                          </Button>
                        </div>
                        {!session && (
                          <div className="flex-1">
                            <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleLoginClick}>
                              Đăng nhập
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

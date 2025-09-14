'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { CardExercise } from '@/components/cards/card-exercise'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { cn } from '@/lib/utils'
import { getUserSubscriptions } from '@/network/client/users'
import { getExercises, queryKeyExercises } from '@/network/client/exercises'
import { queryKeyUserSubscriptions } from '@/network/client/user-subscriptions'
import { getMuscleGroup, queryKeyMuscleGroups } from '@/network/client/muscle-groups'

export default function MuscleGroupExercises() {
  const searchParams = useSearchParams()
  const query = searchParams ? `?${searchParams.toString()}` : ''
  const muscleGroupId = searchParams.get('muscle_group_id')
  const back = searchParams.get('back')

  const router = useRouter()
  const { session } = useSession()
  const [openLogin, setOpenLogin] = useState(false)
  const [openBuyPackage, setOpenBuyPackage] = useState(false)

  const [muscleGroupQuery, exercisesQuery, userSubscriptionsQuery] = useQueries({
    queries: [
      {
        queryKey: [queryKeyMuscleGroups, muscleGroupId],
        queryFn: () => getMuscleGroup(muscleGroupId!),
        enabled: !!muscleGroupId,
      },
      {
        queryKey: [queryKeyExercises, muscleGroupId],
        queryFn: () => getExercises({ muscle_group_id: Number(muscleGroupId) }),
        enabled: !!muscleGroupId,
      },
      {
        queryKey: [queryKeyUserSubscriptions, session?.userId],
        queryFn: () => getUserSubscriptions(session?.userId!),
        enabled: !!session?.userId,
      },
    ],
  })

  const muscleGroup = muscleGroupQuery.data?.data
  const exercises = exercisesQuery.data?.data || []
  const userSubscriptions = userSubscriptionsQuery.data?.data || []

  const isAccessed = userSubscriptions.some((sub) => isActiveSubscription(sub.status, sub.subscription_end_at)) || false

  if (muscleGroupQuery.isLoading || exercisesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!muscleGroupId || !muscleGroup) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Nhóm cơ không tồn tại.</p>
      </div>
    )
  }

  const handleStartExercise = (exerciseId: number) => {
    if (!session) {
      setOpenLogin(true)
      return
    }

    if (!isAccessed) {
      setOpenBuyPackage(true)
      return
    }

    router.push(`/exercises/${exerciseId}${query}`)
  }

  // Navigate to login page
  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(`/exercises${query}`)}`)
  }

  // Navigate to packages page with course ID
  const handleBuyPackageClick = () => {
    router.push(`/packages?redirect=${encodeURIComponent(`/exercises${query}`)}`)
  }

  return (
    <>
      <div className="flex flex-col gap-10 p-4 mt-6 md:mt-10 lg:mt-[76px]">
        <div>
          <Link
            href={back || `/gallery`}
            className="flex cursor-pointer items-center gap-2.5 font-semibold lg:hidden md:mb-7 mb-2"
          >
            <div className="w-6 h-6 pt-1 flex justify-center">
              <BackIconBlack />
            </div>
            Quay về
          </Link>
          <div className="flex flex-col sm:justify-center sm:text-center gap-3.5 sm:gap-5 lg:gap-7 mb-3 sm:mb-6 md:mb-10 lg:mb-[60px]">
            <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl">
              Các động tác thuộc nhóm cơ {muscleGroup.name}
            </div>
            <p className="text-[#737373] text-sm lg:text-lg">{muscleGroup.description}</p>
          </div>
          <div>
            <Tabs defaultValue="all" className="w-full">
              <div className="flex sm:justify-center mb-3 sm:mb-6 md:mb-10 lg:mb-[60px]">
                <TabsList className="bg-white sm:mx-auto">
                  <TabsTrigger
                    value="all"
                    className={cn(
                      'underline text-sm lg:text-lg text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                    )}
                  >
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger
                    value="with-equipment"
                    className={cn(
                      'underline text-sm lg:text-lg text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                    )}
                  >
                    Có dụng cụ
                  </TabsTrigger>
                  <TabsTrigger
                    value="no-equipment"
                    className={cn(
                      'underline text-sm lg:text-lg text-ring bg-white !shadow-none pl-0 pr-5 sm:px-2.5 md:px-4 lg:px-8'
                    )}
                  >
                    Không có dụng cụ
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all">
                <div className="grid grid-cols-3 sm:gap-5 gap-4">
                  {exercises.map((exercise) => (
                    <CardExercise key={exercise.id} data={exercise} onClick={() => handleStartExercise(exercise.id)} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="with-equipment">
                <div className="grid grid-cols-3 sm:gap-5 gap-4">
                  {exercises
                    .filter((exercise) => exercise.equipments && exercise.equipments.length > 0)
                    .map((exercise) => (
                      <CardExercise
                        key={exercise.id}
                        data={exercise}
                        onClick={() => handleStartExercise(exercise.id)}
                      />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="no-equipment">
                <div className="grid grid-cols-3 sm:gap-5 gap-4">
                  {exercises
                    .filter((exercise) => exercise.equipments?.some((equipment) => equipment.name === 'Tay Không'))
                    .map((exercise) => (
                      <CardExercise
                        key={exercise.id}
                        data={exercise}
                        onClick={() => handleStartExercise(exercise.id)}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
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
            <p className="text-base">MUA GÓI MEMBER ĐỂ TRUY CẬP ĐỘNG TÁC</p>
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
            <p className="text-base">ĐĂNG NHẬP ĐỂ TRUY CẬP ĐỘNG TÁC</p>
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

function isActiveSubscription(status: string, endDate: string) {
  const now = new Date()
  const end = new Date(endDate)
  return status === 'active' && end > now
}

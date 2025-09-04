'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useState, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CardExercise } from '@/components/cards/card-exercise'
import { useSession } from '@/hooks/use-session'
import { getUserSubscriptionExercises, removeUserSubscriptionExercise } from '@/network/client/user-subscriptions'
import { useSubscription } from './subscription-context'

export default function ListExercises() {
  const { session } = useSession()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const queryClient = useQueryClient()

  const isSubscriptionExpired = useMemo(() => {
    if (!selectedSubscription?.subscription_end_at) return true
    const endDate = new Date(selectedSubscription.subscription_end_at)
    return new Date() > endDate
  }, [selectedSubscription])

  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
  }

  const handleBuyPackageClick = () => {
    router.push('/account/packages')
  }

  // Fetch subscription exercises with infinite query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ['subscription-exercises', session?.userId, selectedSubscription?.subscription.id],
    queryFn: async ({ pageParam = 0 }) =>
      getUserSubscriptionExercises(session!.userId, selectedSubscription!.subscription.id, {
        page: pageParam,
        per_page: 6,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if ((lastPage.paging.page + 1) * lastPage.paging.per_page >= lastPage.paging.total) {
        return undefined
      }
      return lastPageParam + 1
    },
    enabled: !!session?.userId && !!selectedSubscription?.subscription?.id,
  })

  const isLoading = status === 'pending'

  // Delete exercise mutation
  const { mutate: handleDeleteUserSubscriptionExercise } = useMutation({
    mutationFn: async ({ exerciseId, exerciseTitle }: { exerciseId: number; exerciseTitle: string }) => {
      if (!session?.userId) throw new Error('User not authenticated')
      return await removeUserSubscriptionExercise(session.userId, selectedSubscription?.subscription.id!, exerciseId)
    },
    onSuccess: (_, { exerciseId, exerciseTitle }) => {
      queryClient.setQueryData(
        ['subscription-exercises', session?.userId, selectedSubscription?.subscription.id],
        (oldData: any) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((exercise: any) => exercise.id !== exerciseId),
            })),
          }
        }
      )

      toast.success(`Đã xóa ${exerciseTitle} khỏi danh sách`)
    },
    onError: (error) => {
      console.error('Error deleting exercise:', error)
      toast.error('Có lỗi xảy ra khi xóa động tác')
    },
  })

  // Combine all exercises from all pages
  const combinedExercises = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.data).filter(Boolean)
  }, [data?.pages])

  if (!session) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#13D8A7] text-white lg:text-lg text-sm w-full rounded-full h-14 mt-6 ">
            Thêm động tác
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

  if (combinedExercises.length === 0 && !isLoading) {
    return (
      <Link href="/gallery#exercises">
        <Button className="bg-[#13D8A7] text-white lg:text-lg text-sm w-full rounded-full h-14">Thêm động tác</Button>
      </Link>
    )
  }

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:gap-6 gap-4 mx-auto mt-6 text-base lg:text-lg">
        {combinedExercises.map((exercise) => (
          <CardExercise
            key={exercise.id}
            data={exercise}
            to={`/exercises/${exercise.id}?back=%2Faccount%2Fresources`}
            locked={isSubscriptionExpired}
            onLockedClick={() => setRenewDialogOpen(true)}
            onDelete={() =>
              handleDeleteUserSubscriptionExercise({ exerciseId: exercise.id, exerciseTitle: exercise.name })
            }
          />
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-white text-[#13D8A7] border border-[#13D8A7] hover:bg-[#f0fffc] w-full rounded-full h-14 text-sm lg:text-lg"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-[#13D8A7] rounded-full"></div>
                Đang tải...
              </div>
            ) : (
              'Tải thêm động tác'
            )}
          </Button>
        )}
        <Link href="/gallery#exercises">
          <Button className="bg-[#13D8A7] text-white w-full rounded-full h-14 text-sm lg:text-lg lg:mt-2 mt-2">
            Thêm động tác
          </Button>
        </Link>
      </div>
    </div>
  )
}

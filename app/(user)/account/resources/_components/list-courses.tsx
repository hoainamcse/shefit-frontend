'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CardCourse } from '@/components/cards/card-course'
import { useSession } from '@/hooks/use-session'
import { getUserSubscriptionCourses } from '@/network/client/user-subscriptions'
import { useSubscription } from './subscription-context'

export function ListCourses() {
  const router = useRouter()
  const { session } = useSession()
  const pathname = usePathname()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
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

  const subscriptionCourses = useMemo(() => {
    const courses = selectedSubscription?.subscription?.courses || []
    return courses
  }, [selectedSubscription])

  const courseIds = useMemo(() => {
    return subscriptionCourses.map((course) => course.id)
  }, [subscriptionCourses])

  // Use React Query to fetch courses by IDs
  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['subscription-courses', session?.userId, selectedSubscription?.subscription.id],
    queryFn: () => getUserSubscriptionCourses(session!.userId, selectedSubscription!.subscription.id),
    enabled: !!session?.userId && !!selectedSubscription?.subscription?.id,
  })

  const courses = courseIds.length > 0 ? coursesData?.data || [] : []

  if (!session) {
    return (
      <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#13D8A7] text-white text-sm lg:text-lg w-full rounded-full h-14 lg:mt-12">
              Thêm khóa tập
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center text-center gap-6">
              <p className="text-sm lg:text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
              <div className="flex gap-4 justify-center w-full px-10">
                <div className="flex-1">
                  <Button
                    className="bg-[#13D8A7] rounded-full w-full text-sm lg:text-lg"
                    onClick={handleBuyPackageClick}
                  >
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-base lg:text-lg">
        {courses.map((course) => (
          <CardCourse
            key={course.id}
            data={course}
            to={`/courses/${course.id}?back=%2Faccount%2Fresources&hide_packages=true`}
            locked={isSubscriptionExpired}
            onLockedClick={() => setRenewDialogOpen(true)}
          />
        ))}
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useSession } from '@/components/providers/session-provider'
import { useSubscription } from './SubscriptionContext'
import { getCourse } from '@/network/server/courses'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import { Lock } from 'lucide-react'
import { courseFormLabel } from '@/lib/label'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
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
import type { Course } from '@/models/course'

type CourseWithCategory = Course & {
  category?: string
}

export function ListCourses() {
  const router = useRouter()
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [renewDialogOpen, setRenewDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<CourseWithCategory[]>([])

  const handleLoginClick = () => {
    setDialogOpen(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    setDialogOpen(false)
    redirectToAccount('buy-package')
  }

  const subscriptionCourses = useMemo(() => {
    const courses = selectedSubscription?.subscription?.courses || []
    return courses
  }, [selectedSubscription])

  const courseIds = useMemo(() => {
    return subscriptionCourses.map((course) => course.id)
  }, [subscriptionCourses])

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!selectedSubscription?.subscription?.courses?.length) {
        setCourses([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const coursePromises = subscriptionCourses.map(async (course) => {
          try {
            const courseId = typeof course.id === 'string' ? parseInt(course.id, 10) : course.id
            const response = await getCourse(courseId)
            if (response && response.status === 'success' && response.data) {
              return {
                ...response.data,
                category: (response.data as any).category || '',
              }
            }
            return null
          } catch (error) {
            console.error(`Error fetching course ${course.id}:`, error)
            return null
          }
        })

        const courses = (await Promise.all(coursePromises)).filter(Boolean)
        setCourses(courses as CourseWithCategory[])
      } catch (error) {
        console.error('Error in fetchCourseDetails:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseDetails()
  }, [selectedSubscription, subscriptionCourses, courseIds])

  if (!session) {
    return (
      <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm khóa tập</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
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

  if (!selectedSubscription) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-500 mb-4">Vui lòng chọn gói đăng ký để xem khóa học</p>
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

  if (courses.length === 0) {
    return (
      <Link href="/courses">
        <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm khóa tập</Button>
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
        {courses.map((course) => (
          <div key={course.id} className="group">
            <Link
              href={
                selectedSubscription?.status === 'expired'
                  ? '#'
                  : `/courses/${course.id}/${course.course_format}-classes`
              }
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
                  <div className="absolute top-4 right-4 z-10">
                    <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                  </div>
                  <div className="relative">
                    <img
                      src={course.cover_image}
                      alt={course.course_name}
                      className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                    />
                    {selectedSubscription?.status === 'expired' && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl z-20 flex items-center justify-center">
                        <Lock className="w-12 h-12 text-white" />
                      </div>
                    )}
                    <div className="bg-[#00000033] group-hover:bg-[#00000055] absolute inset-0 transition-all duration-300 rounded-xl" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{course.course_name}</p>
                    <div className="flex gap-2">
                      <p className="text-[#737373]">{course.trainer}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end flex-col items-end">
                    {course.form_categories?.map((cat) => cat.name).join(', ')}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

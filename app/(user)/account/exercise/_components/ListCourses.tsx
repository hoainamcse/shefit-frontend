'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/components/providers/auth-context'
import { useSubscription } from './SubscriptionContext'
import { getCourse } from '@/network/server/courses'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { DeleteIcon } from '@/components/icons/DeleteIcon'
import { courseFormLabel } from '@/lib/label'
import type { Course } from '@/models/course'

type CourseWithCategory = Course & {
  category?: string
}

export function ListCourses() {
  const router = useRouter()
  const { userId } = useAuth()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [courses, setCourses] = useState<CourseWithCategory[]>([])
  const isLoggedIn = !!userId
  interface SubscriptionCourse {
    id: string | number
  }

  const subscriptionCourses = useMemo(() => {
    return (selectedSubscription?.courses as SubscriptionCourse[]) || []
  }, [selectedSubscription?.courses])

  const courseIds = useMemo(() => {
    return subscriptionCourses.map((course) => course.id)
  }, [subscriptionCourses])

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!selectedSubscription || !selectedSubscription.courses || selectedSubscription.courses.length === 0) {
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

  if (!isLoggedIn) {
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
                  <Button
                    className="bg-[#13D8A7] rounded-full w-full text-lg"
                    onClick={() => {
                      setDialogOpen(false)
                      window.location.href = '/account?tab=buy-package'
                    }}
                  >
                    Mua gói
                  </Button>
                </div>
                <div className="flex-1">
                  <Button
                    className="bg-[#13D8A7] rounded-full w-full text-lg"
                    onClick={() => {
                      setDialogOpen(false)
                      window.location.href = '/auth/login'
                    }}
                  >
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
        {courses.map((course) => (
          <div key={course.id} className="group">
            <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
              <div>
                <div className="relative group">
                  <div className="absolute top-4 right-4 z-10">
                    <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                  </div>
                  <img
                    src={course.cover_image}
                    alt={course.course_name}
                    className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                  />
                  <div className="bg-[#00000033] group-hover:bg-[#00000055] absolute inset-0 transition-all duration-300 rounded-xl" />
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{course.course_name}</p>
                    {/* <p className="text-[#737373]">{course.course.category}</p> */}
                    <div className="flex gap-2">
                      <p className="text-[#737373]">{course.trainer}</p>
                      {/* <p className="text-[#737373]">{course.course.days_per_week} tuần</p> */}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end flex-col items-end">
                    <p>{courseFormLabel[course.form_categories[0]]}</p>
                    {/* <Link href={`/courses/${course.course.id}`} className="text-ring underline">
                          Bắt đầu
                        </Link> */}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <Link href="/courses">
        <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm khóa tập</Button>
      </Link>
    </div>
  )
}

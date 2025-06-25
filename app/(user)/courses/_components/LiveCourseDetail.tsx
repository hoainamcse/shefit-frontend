'use client'

import { getCourse } from '@/network/server/courses'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLiveDays } from '@/network/server/courses'
import { Course, LiveDay } from '@/models/course'
import { cn } from '@/lib/utils'
import { useSession } from '@/components/providers/session-provider'
import { getUserSubscriptions } from '@/network/server/user-subscriptions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createUserCourse, getUserCourses } from '@/network/server/user-courses'
import { toast } from 'sonner'
import { UserCourse } from '@/models/user-courses'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'

interface Session {
  id: number
  session_number: number
  name: string
  description: string
  start_time: string
  end_time: string
  link_zoom: string
}

interface LiveDayWithSessions extends LiveDay {
  sessions: Session[]
}

interface UserCourseItem extends UserCourse {
  is_active: boolean
  start_date: string
  end_date: string
  course_id: number
}

const formatToVNTime = (time: string) => {
  const [hours] = time.split(':')
  const vnHour = parseInt(hours) % 24
  return `${vnHour} giờ`
}

export default function LiveCourseDetail({ courseId }: { courseId: Course['id'] }) {
  const { session } = useSession()
  const { redirectToLogin, redirectToAccount } = useAuthRedirect()
  const isLoggedIn = !!session?.userId
  const [course, setCourse] = useState<any>(null)
  const [live, setLive] = useState<any>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(false)
  const [courseStatus, setCourseStatus] = useState<'checking' | 'exists' | 'not_found'>('checking')

  const isClassAvailable = (startTime: string) => {
    if (!isLoggedIn || courseStatus !== 'exists') {
      return true
    }
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    const [startHour, startMinute] = startTime.split(':').map(Number)
    const vnStartHour = (startHour + 7) % 24

    if (currentHour > vnStartHour) {
      return true
    } else if (currentHour === vnStartHour) {
      return currentMinute >= startMinute
    }
    return false
  }

  useEffect(() => {
    const checkUserCourse = async () => {
      if (!session) {
        setCourseStatus('not_found')
        return
      }

      try {
        const response = await getUserCourses(session.userId.toString())
        const userCourse = (response.data as UserCourseItem[])?.find((course) => {
          const userCourseId = Number(course.course_id)
          const currentCourseId = Number(courseId)
          return userCourseId === currentCourseId && course.is_active === true
        })

        if (userCourse) {
          setCourseStatus('exists')
        } else {
          setCourseStatus('not_found')
        }
      } catch (error) {
        console.error('Error checking user course:', error)
        toast.error('Có lỗi xảy ra khi kiểm tra khóa học')
        setCourseStatus('not_found')
      }
    }

    checkUserCourse()
  }, [session, courseId])

  const handleStartClick = async (e: React.MouseEvent) => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    if (courseStatus === 'checking') {
      return
    }

    if (courseStatus === 'not_found') {
      try {
        await createUserCourse({ course_id: courseId }, session.userId)
        toast.success('Bắt đầu khóa tập thành công!')
        setCourseStatus('exists')
      } catch (error) {
        console.error('Error creating user course:', error)
        return
      }
    }
  }

  const handleJoinClass = async (e: React.MouseEvent, session_: Session) => {
    e.preventDefault()

    if (!isLoggedIn) {
      setShowLoginDialog(true)
      return
    }

    setIsCheckingAccess(true)
    try {
      await handleStartClick(e)

      const subscriptions = await getUserSubscriptions(session?.userId!.toString())
      
      // Find all subscriptions that contain the current course
      const subscriptionsWithCourse = subscriptions.data?.filter((subscription) => {
        const hasCourses = subscription.subscription && subscription.subscription.courses
        if (!hasCourses) return false
        
        return subscription.subscription.courses.some(course => Number(course.id) === Number(courseId))
      }) || []
      
      let hasAccess = false
      
      // If user has subscriptions with this course
      if (subscriptionsWithCourse.length > 0) {
        // Sort subscriptions by end date (latest first)
        const sortedSubscriptions = [...subscriptionsWithCourse].sort((a, b) => {
          const dateA = new Date(a.subscription_end_at)
          const dateB = new Date(b.subscription_end_at)
          return dateB.getTime() - dateA.getTime() // Latest end date first
        })
        
        // Check if the latest subscription is still active and not expired
        const latestSubscription = sortedSubscriptions[0]
        const endDate = new Date(latestSubscription.subscription_end_at)
        const currentDate = new Date()
        
        const isActive = latestSubscription.status === 'active'
        const isNotExpired = endDate > currentDate
        
        hasAccess = isActive && isNotExpired
      }

      if (hasAccess) {
        window.open(session_.link_zoom, '_blank')
      } else {
        setShowSubscribeDialog(true)
      }
    } catch (error) {
      console.error('Error checking course access:', error)
      window.open(session_.link_zoom, '_blank')
    } finally {
      setIsCheckingAccess(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourse(courseId)
        setCourse(courseData)

        const liveData = await getLiveDays(courseId)
        setLive(liveData)
      } catch (error) {
        console.error('Error fetching live detail data:', error)
      }
    }

    fetchData()
  }, [courseId])

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  const handleBuyPackageClick = () => {
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.pathname + window.location.search
      const accountUrl = `/account?tab=buy-package&course_id=${courseId}&redirect=${encodeURIComponent(currentUrl)}`
      window.location.href = accountUrl
    }
    setShowLoginDialog(false)
    setShowSubscribeDialog(false)
  }

  if (!course || !live) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 mt-10">
      <Tabs
        defaultValue={live.data && live.data.length > 0 ? live.data[0].day_of_week : 'Monday'}
        className="[state=active]:bg-[#91EBD5] data-[state=active]:shadow-none"
      >
        <TabsList className="bg-white">
          {Array.from(new Set(live.data.map((item: LiveDayWithSessions) => item.day_of_week)) as Set<string>).map(
            (day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="
                    rounded-full mx-[10px] my-5 w-[63px] h-[64px]
                    flex flex-col items-center justify-center
                    font-medium text-xl cursor-pointer
                    data-[state=active]:bg-[#91EBD5] data-[state=active]:text-white
                    bg-transparent hover:bg-[#91EBD5]/10
                    transition-colors duration-200"
              >
                Thứ <br />
                {day === 'Monday'
                  ? '2'
                  : day === 'Tuesday'
                  ? '3'
                  : day === 'Wednesday'
                  ? '4'
                  : day === 'Thursday'
                  ? '5'
                  : day === 'Friday'
                  ? '6'
                  : day === 'Saturday'
                  ? '7'
                  : ''}
              </TabsTrigger>
            )
          )}
        </TabsList>

        {Array.from(new Set(live.data.map((item: LiveDayWithSessions) => item.day_of_week)) as Set<string>).map(
          (day) => (
            <TabsContent key={day} value={day} className="ml-2 mt-10">
              <div className="space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-500 flex flex-col gap-5">
                {live.data
                  .filter((item: LiveDayWithSessions) => item.day_of_week === day)
                  .map((dayItem: LiveDayWithSessions) =>
                    dayItem.sessions
                      .sort((a, b) => a.session_number - b.session_number)
                      .map((session_: Session) => (
                        <div key={session_.id} className="flex justify-between">
                          <div>
                            <p className="font-[family-name:var(--font-coiny)] text-[30px] flex gap-2">
                              {session_.name}
                            </p>
                            <p className="text-[#737373] text-xl">
                              {session_.description} / {formatToVNTime(session_.start_time)} -{' '}
                              {formatToVNTime(session_.end_time)}
                            </p>
                          </div>
                          {isClassAvailable(session_.start_time) ? (
                            <div className="cursor-pointer" onClick={(e) => handleJoinClass(e, session_)}>
                              <div className="text-primary text-xl">
                                {isCheckingAccess ? 'Đang kiểm tra...' : 'Vào lớp'}
                              </div>
                            </div>
                          ) : (
                            <div className={cn('text-gray-400 text-xl cursor-not-allowed', 'relative group')}>
                              Vào lớp
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Lớp học chưa bắt đầu
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                  )}
              </div>
            </TabsContent>
          )
        )}
      </Tabs>

      {showLoginDialog && (
        <Dialog defaultOpen={true} onOpenChange={(open) => !open && setShowLoginDialog(false)}>
          <DialogContent className="bg-white p-6 rounded-2xl shadow-xl border-0 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center text-center gap-6">
              <p className="text-lg">ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP KHÓA TẬP</p>
              <div className="flex gap-4 justify-center w-full px-10">
                <div className="flex-1">
                  <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleBuyPackageClick}>
                    Mua gói Member
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
      )}

      {showSubscribeDialog && (
        <Dialog defaultOpen={true} onOpenChange={(open) => !open && setShowSubscribeDialog(false)}>
          <DialogContent className="bg-white p-6 rounded-2xl shadow-xl border-0 max-w-md">
            <DialogHeader className="items-center">
              <DialogTitle className="text-lg text-center mb-4 text-[#737373]">
                MUA GÓI ĐỂ TRUY CẬP KHÓA TẬP
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6">
              <div className="w-full">
                <Button
                  className="bg-[#13D8A7] hover:bg-[#11c296] text-white rounded-full w-full text-lg font-medium"
                  onClick={handleBuyPackageClick}
                >
                  Mua gói Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

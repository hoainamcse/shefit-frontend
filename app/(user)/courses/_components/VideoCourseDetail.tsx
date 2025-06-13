'use client'

import { ArrowPinkIcon } from '@/components/icons/ArrowPinkIcon'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getWeeks } from '@/network/server/weeks'
import { getDays } from '@/network/server/days'
import { useState, useEffect } from 'react'
import { useSession } from '@/components/providers/session-provider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Course } from '@/models/course'
import { getUserSubscriptions } from '@/network/server/user-subscriptions'
import { getCourse } from '@/network/server/courses'
import { UserCourse } from '@/models/user-courses'
import { createUserCourse, getUserCourses } from '@/network/server/user-courses'
interface UserCourseItem extends UserCourse {
  is_active: boolean
  start_date: string
  end_date: string
  course_id: number
}
type CourseDay = {
  day: number
  content: string
}

type CourseWeek = {
  week: number
  days: CourseDay[]
}

export const mapCourseData = (totalWeeks: number): CourseWeek[] => {
  return Array.from({ length: totalWeeks }, (_, weekIndex) => ({
    week: weekIndex + 1,
    days: Array.from({ length: 7 }, (_, dayIndex) => ({
      day: dayIndex + 1,
      content: `Nội dung ngày ${dayIndex + 1}`,
    })),
  }))
}

export default function VideoCourseDetail({ courseId }: { courseId: Course['id'] }) {
  const [weeks, setWeeks] = useState<any>(null)
  const [days, setDays] = useState<any>(null)
  const [courseData, setCourseData] = useState<CourseWeek[]>([])
  const { session } = useSession()
  const [dialogOpen, setDialogOpen] = useState<string | false>(false)
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(false)
  const [isFreeCourse, setIsFreeCourse] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [courseStatus, setCourseStatus] = useState<'checking' | 'exists' | 'not_found'>('checking')

  const checkUserCourse = async () => {
    if (!session) {
      setCourseStatus('not_found')
      return 'not_found'
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
        return 'exists'
      } else {
        setCourseStatus('not_found')
        return 'not_found'
      }
    } catch (error) {
      console.error('Error checking user course:', error)
      setCourseStatus('not_found')
      return 'not_found'
    }
  }

  useEffect(() => {
    checkUserCourse()
  }, [session, courseId])

  const handleStartClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!session) {
      setShowLoginDialog(true)
      return 'not_logged_in'
    }

    const status = await checkUserCourse()

    if (status === 'not_found') {
      try {
        await createUserCourse({ course_id: courseId }, session.userId)
        setCourseStatus('exists')
        return 'exists'
      } catch (error) {
        console.error('Error creating user course:', error)
        return 'error'
      }
    }

    return status
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weeksData = await getWeeks(courseId)
        setWeeks(weeksData)

        if (weeksData.data && weeksData.data.length > 0) {
          const daysData = await getDays(courseId, weeksData.data[0]?.id)
          setDays(daysData)

          const totalWeeks = weeksData.data.length
          setCourseData(mapCourseData(totalWeeks))
        }
      } catch (error) {
        console.error('Error fetching video detail data:', error)
      }
    }

    fetchData()
  }, [courseId])

  const checkCourseAccess = async () => {
    try {
      const courseResponse = await getCourse(courseId)
      if (courseResponse?.data?.is_free) {
        console.log('Course is free, granting access')
        return true
      }
      if (!session?.userId) return false
      setCheckingAccess(true)
      console.log('Fetching subscriptions for user:', session.userId)
      const subscriptions = await getUserSubscriptions(session.userId)
      console.log('Subscriptions data:', subscriptions.data)

      const hasAccess = subscriptions.data.some((sub: any) => {
        const isActive = sub.status === 'active'
        const hasCourse =
          sub.courses?.some((course: any) => {
            const match = course.id == courseId
            console.log(
              `Checking course: ${course.id} (${typeof course.id}) vs ${courseId} (${typeof courseId}), match: ${match}`
            )
            return match
          }) || false
        console.log(`Subscription ${sub.id}: active=${isActive}, hasCourse=${hasCourse}`)
        return isActive && hasCourse
      })

      console.log('Final access check result:', hasAccess)
      return hasAccess
    } catch (error) {
      console.error('Error checking course access:', error)
      return false
    } finally {
      setCheckingAccess(false)
    }
  }

  useEffect(() => {
    const checkCourse = async () => {
      try {
        const courseResponse = await getCourse(courseId)
        setIsFreeCourse(courseResponse?.data?.is_free || false)
      } catch (error) {
        console.error('Error checking course:', error)
      }
    }
    checkCourse()
  }, [courseId])

  const handleDayClick = async (e: React.MouseEvent, weekId: string, dayId: string) => {
    e.preventDefault()
    console.log('handleDayClick called with:', { weekId, dayId, courseId })

    try {
      if (isFreeCourse) {
        if (!session?.userId) {
          setDialogOpen(`day-${dayId}`)
          return
        }
        const targetUrl = `/courses/${courseId}/video-classes/${weekId}/${dayId}`
        console.log('Free course, navigating to:', targetUrl)
        window.location.href = targetUrl
        return
      }

      if (!session?.userId) {
        console.log('No user ID, showing login dialog')
        setDialogOpen(`day-${dayId}`)
        return
      }

      console.log('Checking course access...')
      const hasAccess = await checkCourseAccess()
      console.log('Course access result:', hasAccess)

      if (hasAccess) {
        const targetUrl = `/courses/${courseId}/video-classes/${weekId}/${dayId}`
        console.log('User has access, navigating to:', targetUrl)
        window.location.href = targetUrl
      } else {
        console.log('No active subscription found, showing purchase dialog')
        setPurchaseDialogOpen(true)
      }
    } catch (error) {
      console.error('Error handling day click:', error)
      setPurchaseDialogOpen(true)
    }
  }

  if (!weeks || !days) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-10 mt-10">
      <Accordion type="multiple" className="mt-3">
        {courseData.map((week, weekIndex) => (
          <AccordionItem key={week.week} value={`week-${week.week}`}>
            <AccordionTrigger className="font-[family-name:var(--font-coiny)] text-ring text-[30px]">
              <div>Tuần {week.week}</div>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="flex flex-col gap-2 text-xl">
                {days.data
                  .sort((a: any, b: any) => a.id - b.id)
                  .map((day: any, index: number) => (
                    <li key={day.id} className="flex justify-between items-center">
                      <div className="flex gap-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-50">Ngày </span>
                        <span className="text-gray-900 dark:text-gray-50">{index + 1}</span>
                        <p>{day.description}</p>
                      </div>
                      {session?.userId ? (
                        <div
                          onClick={async (e) => {
                            e.preventDefault()
                            await checkUserCourse()
                            await handleStartClick(e)
                            handleDayClick(e, weeks.data[weekIndex]?.id, day.id)
                          }}
                          className="cursor-pointer"
                        >
                          <ArrowPinkIcon />
                        </div>
                      ) : (
                        <Dialog
                          open={dialogOpen === `day-${day.id}`}
                          onOpenChange={(open) => {
                            if (!open) setDialogOpen(false)
                          }}
                        >
                          <DialogTrigger asChild>
                            <div onClick={() => setDialogOpen(`day-${day.id}`)} className="cursor-pointer">
                              <ArrowPinkIcon />
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center text-center gap-6">
                              {isFreeCourse ? (
                                <>
                                  <p className="text-lg">ĐĂNG NHẬP ĐỂ TRUY CẬP KHÓA TẬP FREE</p>
                                  <div className="flex justify-center w-full px-10">
                                    <Button
                                      className="bg-[#13D8A7] rounded-full w-full text-lg max-w-xs"
                                      onClick={() => {
                                        setDialogOpen(false)
                                        window.location.href = '/auth/login'
                                      }}
                                    >
                                      Đăng nhập
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="text-lg">ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP KHÓA TẬP</p>
                                  <div className="flex gap-4 justify-center w-full px-10">
                                    <div className="flex-1">
                                      <Button
                                        className="bg-[#13D8A7] rounded-full w-full text-lg"
                                        onClick={() => {
                                          setDialogOpen(false)
                                          window.location.href = '/account?tab=buy-package'
                                        }}
                                      >
                                        Mua gói Member
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
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </li>
                  ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg">HÃY MUA GÓI ĐỂ TRUY CẬP KHÓA TẬP</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button
                  className="bg-[#13D8A7] rounded-full w-full text-lg"
                  onClick={() => {
                    setPurchaseDialogOpen(false)
                    window.location.href = '/account?tab=buy-package'
                  }}
                  disabled={checkingAccess}
                >
                  {checkingAccess ? 'Đang kiểm tra...' : 'Mua gói Member'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

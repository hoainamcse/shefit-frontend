'use client'

import type { Course, DayOfWeek } from '@/models/course'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueries } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSession } from '@/hooks/use-session'
import { cn } from '@/lib/utils'
import { sortByKey } from '@/lib/helpers'
import { checkUserAccessedResource } from '@/network/client/users'
import { getLiveDays, queryKeyLiveDays } from '@/network/client/courses'

const dayOrder: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function LiveCourseDetail({ courseID, query }: { courseID: Course['id']; query: string }) {
  const router = useRouter()
  const { session } = useSession()
  const [openLogin, setOpenLogin] = useState(false)
  const [openBuyPackage, setOpenBuyPackage] = useState(false)

  const isClassAvailable = (dayOfWeek: DayOfWeek) => {
    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Map day names to numbers
    const dayMap: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    }

    const classDayNumber = dayMap[dayOfWeek]

    // Only check if today matches the class day
    return currentDay === classDayNumber
  }

  // Use useQueries to fetch course weeks and check user access
  const queries = useQueries({
    queries: [
      {
        queryKey: [queryKeyLiveDays, courseID],
        queryFn: () => getLiveDays(courseID),
      },
      {
        queryKey: ['user-accessed-resources', session?.userId, 'course', courseID],
        queryFn: () => checkUserAccessedResource(session?.userId!, 'course', courseID),
        enabled: !!session?.userId,
      },
    ],
  })

  const liveDays = queries[0].data?.data || []
  const isLiveDaysLoading = queries[0].isLoading
  const isAccessed = queries[1].data?.data || false

  if (isLiveDaysLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Navigate to course day or show purchase dialog
  const handleStartCourse = async (linkZoom: string) => {
    if (!session) {
      setOpenLogin(true)
      return
    }

    if (!isAccessed) {
      setOpenBuyPackage(true)
      return
    }

    window.open(linkZoom, '_blank')?.focus()
  }

  // Navigate to login page
  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(`/courses/${courseID}/detail${query}`)}`)
  }

  // Navigate to packages page with course ID
  const handleBuyPackageClick = () => {
    router.push(`/packages?course_id=${courseID}&redirect=${encodeURIComponent(`/courses/${courseID}/detail${query}`)}`)
  }

  // Find the tab for today
  const findTodayTab = () => {
    const now = new Date()
    const currentDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const todayName = currentDayNames[now.getDay()]

    const todayTab = liveDays.find((day) => day.day_of_week === todayName)
    return todayTab ? todayTab.id.toString() : liveDays && liveDays.length > 0 ? liveDays[0].id.toString() : undefined
  }

  const daysData = sortByKey(liveDays, 'day_of_week', { transform: (day) => dayOrder.indexOf(day) })

  // Render course weeks and days accordion
  return (
    <div className="flex flex-col gap-10 lg:mt-10 mt-2">
      <Tabs defaultValue={findTodayTab()} className="[state=active]:bg-[#91EBD5] data-[state=active]:shadow-none">
        <TabsList className="bg-transparent flex-wrap h-auto md:justify-start justify-between md:gap-5 gap-0 w-full">
          {daysData.map((day) => (
            <TabsTrigger
              key={day.id}
              value={day.id.toString()}
              className="
                    rounded-full my-5 w-[63px] h-[64px]
                    flex flex-col items-center justify-center
                    font-medium text-lg cursor-pointer
                    data-[state=active]:bg-[#91EBD5] data-[state=active]:text-white
                    bg-transparent hover:bg-[#91EBD5]/10
                    transition-colors duration-200"
            >
              Thứ <br />{' '}
              {day.day_of_week === 'Sunday'
                ? 'CN'
                : day.day_of_week === 'Monday'
                ? '2'
                : day.day_of_week === 'Tuesday'
                ? '3'
                : day.day_of_week === 'Wednesday'
                ? '4'
                : day.day_of_week === 'Thursday'
                ? '5'
                : day.day_of_week === 'Friday'
                ? '6'
                : day.day_of_week === 'Saturday'
                ? '7'
                : ''}
            </TabsTrigger>
          ))}
        </TabsList>

        {daysData.map((day) => (
          <TabsContent key={day.id} value={day.id.toString()} className="ml-2 mt-10">
            <div className="space-y-2 text-xs leading-7 text-gray-600 dark:text-gray-500 flex flex-col gap-5">
              {sortByKey(day.sessions, 'session_number').map((session) => (
                <div key={session.id} className="flex justify-between">
                  <div>
                    <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-lg lg:text-2xl flex gap-2">
                      {session.name}
                    </p>
                    <p className="text-[#737373] text-sm lg:text-lg">
                      {formatTime(session.start_time)} - {formatTime(session.end_time)} (
                      {formatTime(session.start_time).includes('AM') ? 'sáng' : 'chiều/tối'})
                    </p>
                    <p className="text-[#737373] text-sm lg:text-lg">{session.description}</p>
                  </div>
                  {isClassAvailable(day.day_of_week) ? (
                    <div className="cursor-pointer" onClick={() => handleStartCourse(session.link_zoom)}>
                      <div className="text-primary text-sm lg:text-lg">Vào lớp</div>
                    </div>
                  ) : (
                    <div className={cn('text-gray-400 text-sm lg:text-lg cursor-not-allowed', 'relative group')}>
                      Vào lớp
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Lớp học chưa bắt đầu
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Login Dialog */}
      <Dialog open={openLogin} onOpenChange={setOpenLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">ĐĂNG NHẬP TRUY CẬP KHÓA TẬP</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Buy Package Dialog */}
      <Dialog open={openBuyPackage} onOpenChange={setOpenBuyPackage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">MUA GÓI MEMBER ĐỂ TRUY CẬP KHOÁ TẬP</p>
            <div className="w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleBuyPackageClick}>
                Mua gói Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LiveCourseDetail

function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`
  } catch (error) {
    return time
  }
}

'use client'

import type { Course } from '@/models/course'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueries } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { ArrowPinkIcon } from '@/components/icons/ArrowPinkIcon'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useSession } from '@/hooks/use-session'
import { checkUserAccessedResource } from '@/network/client/users'
import { getCourseWeeks, queryKeyCourseWeeks } from '@/network/client/courses'

export function VideoCourseDetail({ courseID, query }: { courseID: Course['id']; query: string }) {
  const router = useRouter()
  const { session } = useSession()
  const [openLogin, setOpenLogin] = useState(false)
  const [openBuyPackage, setOpenBuyPackage] = useState(false)

  // Use useQueries to fetch course weeks and check user access
  const queries = useQueries({
    queries: [
      {
        queryKey: [queryKeyCourseWeeks, courseID],
        queryFn: () => getCourseWeeks(courseID),
      },
      {
        queryKey: ['user-accessed-resources', session?.userId, 'course', courseID],
        queryFn: () => checkUserAccessedResource(session?.userId!, 'course', courseID),
        enabled: !!session?.userId,
      },
    ],
  })

  const courseWeeks = queries[0].data?.data || []
  const isCourseWeeksLoading = queries[0].isLoading
  const isAccessed = queries[1].data?.data || false

  if (isCourseWeeksLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Navigate to course day or show purchase dialog
  const handleStartCourse = async (weekId: number, dayId: number) => {
    if (!session) {
      setOpenLogin(true)
      return
    }

    if (!isAccessed) {
      setOpenBuyPackage(true)
      return
    }

    router.push(`/courses/${courseID}/detail/${weekId}/${dayId}${query}`)
  }

  // Navigate to login page
  const handleLoginClick = () => {
    router.push(`/auth/login?redirect=${encodeURIComponent(`/courses/${courseID}/detail${query}`)}`)
  }

  // Navigate to packages page with course ID
  const handleBuyPackageClick = () => {
    router.push(`/packages?course_id=${courseID}&redirect=${encodeURIComponent(`/courses/${courseID}/detail${query}`)}`)
  }

  // Render course weeks and days accordion
  return (
    <div className="flex flex-col gap-10 lg:mt-10 mt-2">
      <Accordion type="multiple" defaultValue={courseWeeks.map((c) => `week-${c.week_number}`)} className="mt-3">
        {courseWeeks.map((week) => (
          <AccordionItem key={week.id} value={`week-${week.week_number}`}>
            <AccordionTrigger className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] text-ring text-2xl cursor-pointer font-semibold lg:font-bold">
              <div>Tuần {week.week_number}</div>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="flex flex-col gap-2 text-lg">
                {week.days.map((day, index) => (
                  <li key={day.id} className="flex justify-between items-center">
                    <div className="flex gap-1 text-sm lg:text-lg">
                      <span className="font-semibold text-gray-900 dark:text-gray-50">Ngày </span>
                      <span className="text-gray-900 dark:text-gray-50">{index + 1}</span>
                      <p>{day.description}</p>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() => handleStartCourse(week.id, day.id)}
                      aria-label={`Start course day ${index + 1}`}
                    >
                      <ArrowPinkIcon />
                    </div>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

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

export default VideoCourseDetail

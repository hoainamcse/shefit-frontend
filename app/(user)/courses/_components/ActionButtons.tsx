'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createUserCourse } from '@/network/server/user-courses'
import { toast } from 'sonner'
import { Course } from '@/models/course'
import { useSession } from '@/components/providers/session-provider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getUserSubscriptions } from '@/network/server/user-subscriptions'
import { usePathname } from 'next/navigation'

interface ActionButtonsProps {
  courseId: Course['id']
  showDetails: boolean
  handleToggleDetails: () => void
}

export default function ActionButtons({ courseId, showDetails, handleToggleDetails }: ActionButtonsProps) {
  const { session } = useSession()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [hasCourseInSubscription, setHasCourseInSubscription] = useState(false)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const checkCourseInSubscriptions = async () => {
      if (!session) {
        setIsCheckingSubscription(false)
        return
      }

      try {
        const subscriptions = await getUserSubscriptions(session.userId.toString())
        const hasCourse = subscriptions.data?.some((subscription) => {
          const hasActiveSubscription = subscription.status === 'active' && subscription.courses
          if (!hasActiveSubscription) return false
          return subscription.courses.some((course) => {
            const subCourseId = Number(course.id)
            const currentCourseId = Number(courseId)
            return subCourseId === currentCourseId
          })
        })
        setHasCourseInSubscription(!!hasCourse)
      } catch (error) {
        console.error('Error checking course in subscriptions:', error)
      } finally {
        setIsCheckingSubscription(false)
      }
    }

    checkCourseInSubscriptions()
  }, [session, courseId, pathname])

  const handleSaveCourse = async (courseId: Course['id']) => {
    if (!session) {
      setShowLoginDialog(true)
      return
    }

    try {
      await createUserCourse({ course_id: courseId }, session.userId)
      toast.success('Đã lưu khóa tập thành công!')
      setHasCourseInSubscription(true)
    } catch (error) {
      console.error('Error saving course:', error)
      toast.error('Có lỗi xảy ra khi lưu khóa tập!')
    }
  }
  const handleStartClick = (e: React.MouseEvent) => {
    handleToggleDetails()
  }

  return (
    <div>
      <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
        {showDetails ? (
          <Button
            onClick={handleToggleDetails}
            className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296] h-14"
          >
            Trở về
          </Button>
        ) : (
          <Button
            onClick={handleStartClick}
            className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296] h-14"
          >
            Bắt đầu
          </Button>
        )}
        {!isCheckingSubscription && !hasCourseInSubscription && (
          <Button
            onClick={() => {
              if (!session) {
                setShowLoginDialog(true)
              } else {
                handleSaveCourse(courseId)
              }
            }}
            className="w-full rounded-full text-xl bg-white text-[#13D8A7] h-14 border-2 border-[#13D8A7]"
          >
            Lưu
          </Button>
        )}
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg">ĐĂNG NHẬP & MUA GÓI ĐỂ TRUY CẬP KHÓA TẬP</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button
                  className="bg-[#13D8A7] rounded-full w-full text-lg"
                  onClick={() => {
                    setShowLoginDialog(false)
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
                    setShowLoginDialog(false)
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

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { getUserCourses } from '@/network/client/users'
import { toast } from 'sonner'
import { Course } from '@/models/course'
import { UserCourse } from '@/models/user-courses'
import { addFavouriteCourse } from '@/network/client/user-favourites'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { getUserSubscriptions } from '@/network/client/users'
import { useScrollToTop } from '@/hooks/use-scroll-to-top'
interface UserCourseItem extends UserCourse {
  is_active: boolean
  start_date: string
  end_date: string
  course_id: number
}
import { useSession } from '@/hooks/use-session'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
interface ActionButtonsProps {
  courseId: Course['id']
  showDetails: boolean
  handleToggleDetails: () => void
}

export default function ActionButtons({ courseId, showDetails, handleToggleDetails }: ActionButtonsProps) {
  const { session } = useSession()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [courseStatus, setCourseStatus] = useState<'checking' | 'exists' | 'not_found'>('checking')
  const { redirectToLogin } = useAuthRedirect()
  const { scrollToTopInstant } = useScrollToTop()

  useEffect(() => {
    const checkUserCourse = async () => {
      if (!session) {
        setCourseStatus('not_found')
        return
      }

      try {
        const subscriptionsResponse = await getUserSubscriptions(session.userId.toString())
        const currentCourseId = Number(courseId)

        const courseInSubscription = subscriptionsResponse.data?.some((subscription) =>
          subscription.subscription?.courses?.some((course) => Number(course.id) === currentCourseId)
        )

        if (courseInSubscription) {
          setCourseStatus('exists')
          return
        }

        const coursesResponse = await getUserCourses(session.userId.toString())
        const userCourse = (coursesResponse.data as UserCourseItem[])?.find((course) => {
          const userCourseId = Number(course.course_id)
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
    handleToggleDetails()
    scrollToTopInstant()
  }

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
  }

  const showSaveButton = !showDetails && courseStatus !== 'exists'

  return (
    <div>
      <div className="lg:gap-5 gap-3 w-2/3 mx-auto mb-10 flex justify-center md:mt-20 mt-12 max-lg:w-full max-lg:px-3">
        <div className={showSaveButton ? 'w-1/2' : 'w-full'}>
          {showDetails ? (
            <Button
              onClick={() => {
                handleToggleDetails()
                scrollToTopInstant()
              }}
              className="w-full rounded-full text-lg bg-[#13D8A7] text-white hover:bg-[#11c296] h-14"
            >
              Trở về
            </Button>
          ) : (
            <Button
              onClick={handleStartClick}
              className="w-full rounded-full text-lg bg-[#13D8A7] text-white hover:bg-[#11c296] h-14"
            >
              Bắt đầu
            </Button>
          )}
        </div>
        {showSaveButton && (
          <div className="w-1/2">
            <Button
              onClick={async () => {
                if (!session) {
                  setShowLoginDialog(true)
                  return
                }
                try {
                  await addFavouriteCourse(session.userId.toString(), courseId.toString())
                  toast.success('Đã thêm khóa học vào danh sách yêu thích!')
                } catch (error) {
                  console.error('Error saving to favorites:', error)
                  toast.error('Có lỗi xảy ra khi lưu vào danh sách yêu thích!')
                }
              }}
              className="w-full rounded-full text-lg bg-white text-[#13D8A7] h-14 border-2 border-[#13D8A7] hover:bg-gray-50"
            >
              Lưu
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-base">ĐĂNG NHẬP ĐỂ LƯU KHÓA TẬP</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

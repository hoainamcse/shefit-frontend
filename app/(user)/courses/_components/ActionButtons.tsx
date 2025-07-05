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

  useEffect(() => {
    const checkUserCourse = async () => {
      if (!session) {
        setCourseStatus('not_found')
        return
      }

      try {
        // First check in user subscriptions
        const subscriptionsResponse = await getUserSubscriptions(session.userId.toString())
        const currentCourseId = Number(courseId)

        // Check if the course exists in any subscription's courses
        const courseInSubscription = subscriptionsResponse.data?.some(subscription =>
          subscription.subscription?.courses?.some(course =>
            Number(course.id) === currentCourseId
          )
        )

        if (courseInSubscription) {
          setCourseStatus('exists')
          return
        }

        // If not found in subscriptions, check in user courses as a fallback
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
  }

  const handleLoginClick = () => {
    setShowLoginDialog(false)
    redirectToLogin()
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
          <>
            <Button
              onClick={handleStartClick}
              className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296] h-14"
            >
              Bắt đầu
            </Button>
            {courseStatus !== 'exists' && (
              <Button
                onClick={async () => {
                  if (!session) {
                    setShowLoginDialog(true)
                    return
                  }
                  try {
                    await addFavouriteCourse(session.userId.toString(), courseId.toString())
                    toast.success('Đã thêm vào danh sách yêu thích thành công!')
                  } catch (error) {
                    console.error('Error saving to favorites:', error)
                    toast.error('Có lỗi xảy ra khi lưu vào danh sách yêu thích!')
                  }
                }}
                className="w-full rounded-full text-xl bg-white text-[#13D8A7] h-14 border-2 border-[#13D8A7]"
              >
                Lưu
              </Button>
            )}
          </>
        )}
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg">ĐĂNG NHẬP ĐỂ LƯU KHÓA TẬP</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={handleLoginClick}>
                Đăng nhập
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

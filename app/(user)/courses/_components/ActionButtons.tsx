'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createUserCourse } from '@/network/server/user-courses'
import { toast } from 'sonner'
import { Course } from '@/models/course'

interface ActionButtonsProps {
  courseId: Course['id']
  showDetails: boolean
  handleToggleDetails: () => void
}

const handleSaveCourse = async (courseId: Course['id']) => {
  try {
    await createUserCourse({ course_id: courseId }, '1')
    toast.success('Đã lưu khóa tập thành công!')
  } catch (error) {
    console.error('Error saving course:', error)
    toast.error('Có lỗi xảy ra khi lưu khóa tập!')
  }
}

export default function ActionButtons({ courseId, showDetails, handleToggleDetails }: ActionButtonsProps) {
  return (
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
      {/* <Link href={`/courses/${courseId}/detail`} className="w-full">
        <Button className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296] h-14">Bắt đầu</Button>
      </Link> */}
      <Button
        onClick={handleToggleDetails}
        className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296] h-14"
      >
        {showDetails ? 'Trở về' : 'Bắt đầu'}
      </Button>
      <Button
        onClick={() => handleSaveCourse(courseId)}
        className="w-full rounded-full text-xl bg-white text-[#13D8A7] h-14 border-2 border-[#13D8A7]"
      >
        Lưu
      </Button>
    </div>
  )
}

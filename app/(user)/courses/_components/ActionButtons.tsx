"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createUserCourse } from "@/network/server/user-courses"
import { toast } from "sonner"

interface ActionButtonsProps {
  courseId: string
}

const handleSaveCourse = async (courseId: string) => {
  try {
    await createUserCourse({ course_id: courseId }, "1")
    toast.success("Đã lưu khóa tập thành công!")
  } catch (error) {
    console.error("Error saving course:", error)
    toast.error("Có lỗi xảy ra khi lưu khóa tập!")
  }
}

export default function ActionButtons({ courseId }: ActionButtonsProps) {
  return (
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
      <Link href={`/courses/${courseId}/detail`} className="w-full">
        <Button className="w-full rounded-full text-xl bg-button text-white hover:bg-[#11c296] h-14">Bắt đầu</Button>
      </Link>
      <Button
        onClick={() => handleSaveCourse(courseId)}
        className="w-full rounded-full text-xl bg-white text-button h-14 border-2 border-button"
      >
        Lưu
      </Button>
    </div>
  )
}

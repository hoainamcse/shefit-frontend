"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserCourses } from "@/network/server/user-courses"
import { courseFormLabel } from "@/lib/label"
import { DeleteIcon } from "@/components/icons/DeleteIcon"
import { useAuth } from "@/components/providers/auth-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserCourse } from "@/models/user-courses"
import { ListResponse } from "@/models/response"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ListCourses() {
  const router = useRouter()
  const { userId } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [courses, setCourses] = useState<ListResponse<UserCourse>>({
    status: "",
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)
  const isLoggedIn = !!userId

  useEffect(() => {
    async function fetchCourses() {
      if (!isLoggedIn) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await getUserCourses(userId.toString())
        setCourses(response)
      } catch (error) {
        console.error("Error fetching user courses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [userId, isLoggedIn])

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
                      window.location.href = "/account?tab=buy-package"
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
                      window.location.href = "/auth/login"
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
      <div>
        <div className="text-gray-500 text-xl">Đang tải...</div>
      </div>
    )
  }

  return (
    <>
      {courses.data.length === 0 ? (
        <div>
          <div className="text-gray-500 text-xl">Bạn chưa có khóa tập nào</div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
            {courses.data.map((course: UserCourse) => (
              <div key={course.id}>
                <Link href={`/courses/${course.course.id}/${course.course.course_format}-classes`}>
                  <div>
                    <div className="relative group">
                      <div className="absolute top-4 right-4 z-10">
                        <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                      </div>
                      <img
                        src={course.course.cover_image}
                        alt={course.course.course_name}
                        className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                      />
                      <div className="bg-[#00000033] group-hover:bg-[#00000055] absolute inset-0 transition-all duration-300 rounded-xl" />
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{course.course.course_name}</p>
                        {/* <p className="text-[#737373]">{course.course.category}</p> */}
                        <div className="flex gap-2">
                          <p className="text-[#737373]">{course.course.trainer}</p>
                          {/* <p className="text-[#737373]">{course.course.days_per_week} tuần</p> */}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end flex-col items-end">
                        <p>{courseFormLabel[course.course.form_categories[0]]}</p>
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
          <Link href="/exercise/detail">
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm khóa tập</Button>
          </Link>
        </div>
      )}
    </>
  )
}

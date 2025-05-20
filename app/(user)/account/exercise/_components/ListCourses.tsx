import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserCourses } from "@/network/server/user-courses"
import { getFormCategoryLabel } from "@/lib/label"
import { DeleteIcon } from "@/components/icons/DeleteIcon"

export default async function ListCourses() {
  const courses = await getUserCourses("1")
  return (
    <>
      {courses.data.length === 0 ? (
        <div>
          <div className="text-gray-500 text-xl">Bạn chưa có khóa tập nào</div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
            {courses.data.map((course) => (
              <div key={course.id}>
                <Link href={`/menu/${course.course.id}`}>
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
                        <p>{getFormCategoryLabel(course.course.form_categories[0])}</p>
                        {/* <Link href={`/courses/${course.course.id}`} className="text-text underline">
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
            <Button className="bg-button text-white text-xl w-full rounded-full h-14 mt-6">Thêm khóa tập</Button>
          </Link>
        </div>
      )}
    </>
  )
}

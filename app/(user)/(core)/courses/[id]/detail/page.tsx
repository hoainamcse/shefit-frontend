import type { CourseLevel } from '@/models/course'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { getCourse } from '@/network/server/courses'
import { courseLevelLabel } from '@/lib/label'
import { serializeSearchParams } from '@/utils/searchParams'
import { LiveCourseDetail } from './_components/course-live-detail'
import { VideoCourseDetail } from './_components/course-video-detail'

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const _params = await params
  const _searchParams = await searchParams

  const courseID = Number(_params.id)
  const query = serializeSearchParams(_searchParams)
  const { data: course } = await getCourse(courseID)

  if (!course) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Khóa tập không tồn tại hoặc đã bị xóa.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="relative block md:hidden">
        <Button
          className="items-center text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent text-black dark:text-white shadow-none font-medium"
          asChild
        >
          <Link href={`/courses/${courseID}${query}`}>
            <BackIconBlack /> Quay về
          </Link>
        </Button>
        <img
          src={course.assets.mobile_cover || course.assets.thumbnail}
          alt={`${courseID}`}
          className="w-full aspect-[400/255] object-cover block md:hidden"
        />
      </div>
      <div className="flex flex-col mx-auto max-w-[1800px] gap-10 lg:mt-5 mt-2 w-full md:pb-24 pb-0 p-3 xl:p-4">
        <img
          src={course.assets.desktop_cover || course.assets.mobile_cover || course.assets.thumbnail}
          alt={course.course_name}
          className="rounded-xl w-full aspect-[1800/681] object-cover hidden md:block"
        />
        <div className="flex justify-between text-base">
          <div>
            <p className="font-medium text-sm lg:text-xl">{course.course_name}</p>
            <p className="text-[#737373] text-sm lg:text-xl">
              {courseLevelLabel[course.difficulty_level as CourseLevel]}
            </p>
            <p className="text-[#737373] text-sm lg:text-xl">{course.trainer}</p>
          </div>
          <div className="text-gray-500 text-sm lg:text-xl">
            {course.relationships?.form_categories.map((fg) => fg.name).join(', ')}
          </div>
        </div>

        {course.course_format === 'video' ? (
          <VideoCourseDetail courseID={courseID} query={query} />
        ) : (
          <LiveCourseDetail courseID={courseID} query={query} />
        )}
      </div>
    </div>
  )
}

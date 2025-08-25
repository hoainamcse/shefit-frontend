'use client'

import { getCourse } from '@/network/client/courses'
import { courseFormLabel, courseLevelLabel } from '@/lib/label'
import { useState, useEffect } from 'react'
import { CourseLevel, CourseForm, Course } from '@/models/course'
import LiveCourseDetail from '../_components/LiveCourseDetail'
import VideoCourseDetail from '../_components/VideoCourseDetail'
import { useParams, useSearchParams } from 'next/navigation'
import ActionButtons from '../_components/ActionButtons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from '@/hooks/use-session'
import { BackIconBlack } from '@/components/icons/BackIconBlack'

export default function CourseDetail() {
  const params = useParams()
  const courseID = params.course_id as unknown as Course['id']
  const searchParams = useSearchParams()
  const back = searchParams.get('back') || ''
  const { session } = useSession()
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourse(courseID)
        setCourse(courseData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseID, session?.userId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
          <Link href={`/courses/${courseID}${back ? `?back=${encodeURIComponent(back)}` : ''}`}>
            <BackIconBlack /> Quay về
          </Link>
        </Button>
        <img
          src={course?.data?.assets.mobile_cover || course?.data?.assets.thumbnail}
          alt={`${courseID}`}
          className="w-full aspect-[400/255] object-cover block md:hidden"
        />
      </div>
      <div className="flex flex-col mx-auto max-w-[1800px] gap-10 lg:mt-5 mt-2 w-full md:pb-24 pb-0 p-3 xl:p-4">
        <img
          src={
            course?.data?.assets.desktop_cover || course?.data?.assets.mobile_cover || course?.data?.assets.thumbnail
          }
          alt={`${courseID}`}
          className="rounded-xl w-full aspect-[1800/681] object-cover hidden md:block"
        />
        <div className="flex justify-between text-base">
          <div>
            <p className="font-medium text-sm lg:text-xl">{course?.data?.course_name}</p>
            <p className="text-[#737373] text-sm lg:text-xl">
              {course?.data && courseLevelLabel[course.data.difficulty_level as CourseLevel]}
            </p>
            <p className="text-[#737373] text-sm lg:text-xl">{course?.data?.trainer}</p>
          </div>
          <div className="text-gray-500 text-sm lg:text-xl">
            {course?.data?.form_categories &&
              (Array.isArray(course.data.form_categories)
                ? course.data.form_categories.map((cat: CourseForm) => courseFormLabel[cat]).join(', ')
                : courseFormLabel[course.data.form_categories as CourseForm])}
          </div>
        </div>

        {course.data.course_format === 'video' ? (
          <VideoCourseDetail courseId={courseID} />
        ) : (
          <LiveCourseDetail courseId={courseID} />
        )}
      </div>

      <ActionButtons courseId={courseID} showDetails back={back} />
    </div>
  )
}

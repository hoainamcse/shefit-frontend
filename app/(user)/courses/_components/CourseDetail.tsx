'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getCourse } from '@/network/server/courses'
import { courseFormLabel, courseLevelLabel } from '@/lib/label'
import { useState, useEffect, useRef } from 'react'
import { CourseLevel, CourseForm, Course } from '@/models/course'
import LiveCourseDetail from './LiveCourseDetail'
import VideoCourseDetail from './VideoCourseDetail'
import { BackIcon } from '@/components/icons/BackIcon'
import { useRouter } from 'next/navigation'
import ActionButtons from './ActionButtons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
interface CourseDetailProps {
  courseId: Course['id']
  typeCourse: 'video' | 'live'
}

export default function CourseDetail({ courseId, typeCourse }: CourseDetailProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const footerRef = useRef<HTMLDivElement>(null)

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourse(courseId)
        setCourse(courseData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [courseId])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    )

    const siteFooter = document.querySelector('footer')

    if (siteFooter) {
      observer.observe(siteFooter)

      return () => {
        observer.unobserve(siteFooter)
      }
    } else {
      const footerDetector = footerRef.current
      if (footerDetector) {
        observer.observe(footerDetector)

        return () => {
          observer.unobserve(footerDetector)
        }
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex max-w-screen-2xl mx-auto flex-col gap-10 mt-10 w-full pb-24 relative">
      <div className="p-6 flex flex-col gap-10">
        <div className="flex items-center gap-[10px] cursor-pointer" onClick={() => router.back()}>
          <BackIcon color="#000000" style={{ marginBottom: '4px' }} />
          <div className="text-xl text-[#000000] font-semibold">Quay về</div>
        </div>
        <img
          src={course?.data?.thumbnail_image}
          alt={`${courseId}`}
          className="rounded-xl mb-4 w-full h-[680px] object-cover"
        />

        <div className="flex justify-between text-lg">
          <div>
            <p className="font-medium">{course?.data?.course_name}</p>
            <p className="text-[#737373]">
              {course?.data && courseLevelLabel[course.data.difficulty_level as CourseLevel]}
            </p>
            <p className="text-[#737373]">{course?.data?.trainer}</p>
          </div>
          <div className="text-gray-500">
            {course?.data?.form_categories &&
              (Array.isArray(course.data.form_categories)
                ? course.data.form_categories.map((cat: CourseForm) => courseFormLabel[cat]).join(', ')
                : courseFormLabel[course.data.form_categories as CourseForm])}
          </div>
        </div>
        {course?.data?.relationships?.subscriptions?.length > 0 && (
          <div>
            <div className="font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px]">Gói Member</div>
            <div className="text-[#737373] text-lg">Bạn cần mua các Gói Member sau để truy cập khóa tập</div>
            <div className="flex flex-wrap gap-2 mt-4">
              {course?.data?.relationships?.subscriptions?.map((subscription: any) => (
                <Link
                  key={subscription.id}
                  href={`/packages/detail/${subscription.id}`}
                  className="text-lg rounded-full hover:bg-primary/90 bg-[#319F43]"
                >
                  <Button
                    key={subscription.id}
                    variant="default"
                    className="text-lg rounded-full hover:bg-primary/90 py-2 px-5 bg-[#319F43]"
                  >
                    {subscription.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="bg-primary rounded-xl my-4 p-4">
          <p className="text-white text-center text-2xl">Tóm tắt khoá tập</p>
          <ul className="text-white list-disc pl-8">
            <li>{course?.data?.summary}</li>
          </ul>
        </div>

        {showDetails ? (
          typeCourse === 'video' ? (
            <VideoCourseDetail courseId={courseId} />
          ) : (
            <LiveCourseDetail courseId={courseId} />
          )
        ) : (
          <>
            <div>
              <p className="font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px]">Thông tin</p>
              <p className="text-[#737373] text-lg">{course?.data?.description}</p>
            </div>
            {course?.data?.relationship?.equipments?.length > 0 && (
              <div>
                <p className="font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px]">Dụng cụ</p>
                <ScrollArea className="w-screen-max-xl">
                  <div className="flex w-max space-x-4 py-4">
                    {course?.data?.equipments?.map((equipment: any, index: number) => (
                      <figure key={`equipment-${equipment.id}-${index}`} className="shrink-0">
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={equipment.image}
                            alt={equipment.name}
                            className="w-[168px] h-[175px] object-cover"
                          />
                        </div>
                        <figcaption className="pt-2 font-semibold text-lg text-muted-foreground">
                          {equipment.name}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
            {course?.data?.relationship?.muscle_groups?.length > 0 && (
              <div>
                <p className="font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px]">Nhóm cơ</p>
                <ScrollArea className="w-screen-max-xl">
                  <div className="flex w-max space-x-4 py-4">
                    {course?.data?.relationship?.muscle_groups?.map((muscleGroup: any, index: number) => (
                      <figure key={`muscleGroup-${muscleGroup.id}-${index}`} className="shrink-0">
                        <div className="overflow-hidden rounded-md">
                          <img
                            src={muscleGroup.image}
                            alt={muscleGroup.name}
                            className="w-[168px] h-[175px] object-cover"
                          />
                        </div>
                        <figcaption className="pt-2 font-semibold text-lg text-muted-foreground">
                          {muscleGroup.name}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
          </>
        )}
      </div>

      <ActionButtons courseId={courseId} showDetails={showDetails} handleToggleDetails={handleToggleDetails} />
    </div>
  )
}

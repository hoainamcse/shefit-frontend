'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getCourse } from '@/network/client/courses'
import { courseFormLabel, courseLevelLabel } from '@/lib/label'
import { useState, useEffect, useRef } from 'react'
import { CourseLevel, CourseForm, Course } from '@/models/course'
import LiveCourseDetail from './LiveCourseDetail'
import VideoCourseDetail from './VideoCourseDetail'
import { useRouter } from 'next/navigation'
import ActionButtons from './ActionButtons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from '@/hooks/use-session'
import { getUserSubscriptions } from '@/network/client/users'
import { HtmlContent } from '@/components/html-content'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { getEquipments } from '@/network/client/equipments'
import { getMuscleGroups } from '@/network/client/muscle-groups'

interface CourseDetailProps {
  courseId: Course['id']
  typeCourse: 'video' | 'live'
}

export default function CourseDetail({ courseId, typeCourse }: CourseDetailProps) {
  const router = useRouter()
  const { session } = useSession()
  const [showDetails, setShowDetails] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [equipments, setEquipments] = useState<any[]>([])
  const [muscleGroups, setMuscleGroups] = useState<any[]>([])
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userSubscriptions, setUserSubscriptions] = useState<number[]>([])
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(true)

  const footerRef = useRef<HTMLDivElement>(null)

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourse(courseId)
        setCourse(courseData)

        if (courseData?.data?.equipment_ids?.length > 0) {
          try {
            const equipmentsData = await getEquipments({ ids: courseData.data.equipment_ids })
            setEquipments(equipmentsData?.data || [])
          } catch (error) {
            console.error('Error fetching equipments:', error)
            setEquipments([])
          }
        }

        if (courseData?.data?.muscle_group_ids?.length > 0) {
          try {
            const muscleGroupsData = await getMuscleGroups({ ids: courseData.data.muscle_group_ids })
            setMuscleGroups(muscleGroupsData?.data || [])
          } catch (error) {
            console.error('Error fetching muscle groups:', error)
            setMuscleGroups([])
          }
        }

        if (session?.userId) {
          const userSubscriptionsData = await getUserSubscriptions(session.userId.toString())
          const subscribedIds = userSubscriptionsData.data?.map((sub) => sub.subscription.id) || []
          setUserSubscriptions(subscribedIds)

          // Check if any subscription is still valid (subscription_end_at is in the future)
          const subscriptions = userSubscriptionsData.data || []
          const hasValidSubscription = subscriptions.some((sub) => {
            if (!sub.subscription_end_at) return false
            const endDate = new Date(sub.subscription_end_at)
            return new Date() <= endDate
          })

          setIsSubscriptionExpired(!hasValidSubscription)
        } else {
          setIsSubscriptionExpired(true)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseId, session?.userId])

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
    <div>
      <div className="relative block md:hidden">
        <Button
          onClick={() => router.back()}
          className="flex items-center text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent text-black dark:text-white shadow-none font-medium"
        >
          <BackIconBlack /> Quay về
        </Button>
        <img
          src={course?.data?.assets.mobile_cover || course?.data?.assets.thumbnail}
          alt={`${courseId}`}
          className="w-full aspect-[400/255] object-cover block md:hidden"
        />
      </div>
      <div className="flex flex-col mx-auto max-w-[1800px] gap-10 lg:mt-5 mt-2 w-full md:pb-24 pb-0 p-3 xl:p-4">
        <img
          src={
            course?.data?.assets.desktop_cover || course?.data?.assets.mobile_cover || course?.data?.assets.thumbnail
          }
          alt={`${courseId}`}
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
        {!showDetails && course?.data?.relationships?.subscriptions?.length > 0 && isSubscriptionExpired && (
          <div className="flex flex-col lg:gap-5 gap-2">
            <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl xl:text-4xl uppercase">
              Gói Member
            </div>
            <div className="text-[#737373] text-lg lg:text-xl">Bạn cần mua các Gói Member sau để truy cập khóa tập</div>
            <div
              className="flex overflow-x-scroll gap-2 mt-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {course?.data?.relationships?.subscriptions?.map((subscription: any) => {
                const hasPurchased = userSubscriptions.includes(subscription.id)
                return (
                  <Link
                    key={subscription.id}
                    href={`/packages/${subscription.id}`}
                    className={`text-sm rounded-full hover:opacity-90 ${
                      hasPurchased ? 'bg-[#319F43]' : 'bg-[#DA1515]'
                    }`}
                  >
                    <Button
                      key={subscription.id}
                      variant="default"
                      className={`text-sm rounded-full hover:opacity-90 py-2 px-5 ${
                        hasPurchased ? 'bg-[#319F43]' : 'bg-[#DA1515]'
                      }`}
                    >
                      {subscription.name}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
        {!showDetails && course?.data?.summary && (
          <div className="bg-primary rounded-xl my-4 p-4 lg:p-5">
            <p className="text-white text-center text-lg lg:text-4xl lg:font-bold font-medium lg:mb-4 mb-1 font-[family-name:var(--font-roboto)]">
              Tóm tắt khoá học
            </p>
            <div className="xl:px-10 max-lg:w-full mx-auto text-white h-full flex flex-col items-start list-disc pl-5">
              {course.data.summary.split('\n').map((line: string, index: number) => (
                <div key={index} className="text-[#F7F7F7] text-sm lg:text-xl mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {showDetails ? (
          typeCourse === 'video' ? (
            <VideoCourseDetail courseId={courseId} />
          ) : (
            <LiveCourseDetail courseId={courseId} />
          )
        ) : (
          <>
            <div>
              <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl xl:text-4xl mb-4">
                Thông tin khóa
              </p>
              <HtmlContent
                content={course?.data?.description}
                className="text-[#737373] text-sm lg:text-lg whitespace-pre-line"
              />
            </div>
            {course?.data?.equipment_ids?.length > 0 && equipments.length > 0 && (
              <div>
                <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl xl:text-4xl mb-4">
                  Dụng cụ
                </p>
                <ScrollArea className="w-screen-max-xl">
                  <div className="flex w-max space-x-4 py-4">
                    {equipments
                      .filter((equipment: any) => course.data.equipment_ids.includes(equipment.id))
                      .map((equipment: any, index: number) => (
                        <figure key={`equipment-${equipment.id}-${index}`} className="shrink-0">
                          <div className="overflow-hidden rounded-md">
                            <img
                              src={equipment.image}
                              alt={equipment.name}
                              className="w-[168px] h-[175px] object-cover"
                            />
                          </div>
                          <figcaption className="pt-2 font-medium text-base lg:text-lg text-muted-foreground text-center">
                            {equipment.name}
                          </figcaption>
                        </figure>
                      ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}
            {course?.data?.muscle_group_ids?.length > 0 && muscleGroups.length > 0 && (
              <div>
                <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl xl:text-4xl mb-4">
                  Nhóm cơ
                </p>
                <ScrollArea className="w-screen-max-xl">
                  <div className="flex w-max space-x-4 py-4">
                    {muscleGroups
                      .filter((muscleGroup: any) => course.data.muscle_group_ids.includes(muscleGroup.id))
                      .map((muscleGroup: any, index: number) => (
                        <figure key={`muscleGroup-${muscleGroup.id}-${index}`} className="shrink-0">
                          <div className="overflow-hidden rounded-md">
                            <img
                              src={muscleGroup.image}
                              alt={muscleGroup.name}
                              className="w-[168px] h-[175px] object-cover"
                            />
                          </div>
                          <figcaption className="pt-2 font-medium text-base lg:text-lg text-muted-foreground text-center">
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

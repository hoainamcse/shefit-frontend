'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { getCourse, queryKeyCourses } from '@/network/client/courses'
import { courseLevelLabel } from '@/lib/label'
import { useQueries } from '@tanstack/react-query'
import { CourseLevel, Course } from '@/models/course'
import { queryKeyUserSubscriptions } from '@/network/client/user-subscriptions'
import { useParams, useSearchParams } from 'next/navigation'
import { ActionButtons } from './_components/action-buttons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useSession } from '@/hooks/use-session'
import { getUserSubscriptions } from '@/network/client/users'
import { HTMLRenderer } from '@/components/html-renderer'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { ShoppingCart } from 'lucide-react'

export default function CoursePage() {
  const params = useParams()
  const courseID = params.id as unknown as Course['id']
  const searchParams = useSearchParams()
  const query = searchParams ? `?${searchParams.toString()}` : ''
  const back = searchParams?.get('back') || ''
  const hidePackages = searchParams?.get('hide_packages') === 'true'
  const { session } = useSession()

  // Use useQueries to fetch both course data and user subscriptions
  const [{ data: courseData, isLoading: isCourseLoading }, { data: userSubscriptionsData }] = useQueries({
    queries: [
      {
        queryKey: [queryKeyCourses, courseID],
        queryFn: () => getCourse(courseID),
        enabled: !!courseID,
      },
      {
        queryKey: [queryKeyUserSubscriptions, session?.userId],
        queryFn: () => getUserSubscriptions(session?.userId!),
        enabled: !!session?.userId,
      },
    ],
  })

  const course = courseData?.data
  const courseEquipments = course?.relationships?.equipments || []
  const courseMuscleGroups = course?.relationships?.muscle_groups || []
  const courseSubscriptions = course?.relationships?.subscriptions || []

  const userSubscriptions = userSubscriptionsData?.data || []
  const purchasedSubscriptionIds = userSubscriptions.map((sub) => sub.subscription.id)
  const enableSave = !courseSubscriptions.some(
    (sub) =>
      purchasedSubscriptionIds.includes(sub.id) &&
      isActiveSubscription(
        userSubscriptions.find((s) => s.subscription.id === sub.id)?.status || '',
        userSubscriptions.find((s) => s.subscription.id === sub.id)?.subscription_end_at || ''
      )
  )

  if (isCourseLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

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
          <Link href={back || '/courses'}>
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
          alt={`${courseID}`}
          className="rounded-xl w-full aspect-[1800/681] object-cover hidden md:block"
        />
        <div className="flex justify-between text-base">
          <div>
            <p className="font-medium text-sm lg:text-xl">{course?.course_name}</p>
            <p className="text-[#737373] text-sm lg:text-xl">
              {courseLevelLabel[course.difficulty_level as CourseLevel]}
            </p>
            <p className="text-[#737373] text-sm lg:text-xl">{course?.trainer}</p>
          </div>
          <div className="text-gray-500 text-sm lg:text-xl">
            {course.relationships?.form_categories.map((fg) => fg.name).join(', ')}
          </div>
        </div>
        {!hidePackages && courseSubscriptions.length > 0 && (
          <div className="flex flex-col lg:gap-5 gap-2">
            <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl xl:text-4xl uppercase">
              Gói Member
            </div>
            <div className="text-[#737373] text-lg lg:text-xl">
              {enableSave
                ? 'Bạn cần mua hoặc gia hạn gói Member để truy cập khoá tập này.'
                : 'Bạn có thể truy cập khoá tập này. Hãy tận hưởng và luyện tập chăm chỉ!'}
            </div>
            <div
              className="flex overflow-x-scroll gap-2 mt-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex flex-col w-full">
                <div className="flex flex-wrap gap-3 mb-4">
                  {courseSubscriptions.map((subscription) => {
                    const hasPurchased = purchasedSubscriptionIds.includes(subscription.id)
                    const isActive =
                      hasPurchased &&
                      userSubscriptions.some(
                        (sub) =>
                          sub.subscription.id === subscription.id &&
                          isActiveSubscription(sub.status, sub.subscription_end_at)
                      )

                    return (
                      <Button
                        key={subscription.id}
                        variant="default"
                        className={`text-sm md:text-base rounded-full hover:opacity-90 py-2 px-5 flex items-center gap-2 ${
                          !hasPurchased
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-500'
                            : isActive
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                        asChild
                      >
                        <Link
                          href={`/packages/${subscription.id}?back=${encodeURIComponent(
                            `/courses/${courseID}${query}`
                          )}`}
                        >
                          {subscription.name}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
                <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
                  <p>
                    • <span className="font-medium">Chưa mua</span>: Bạn cần mua gói này để truy cập khóa tập
                  </p>
                  <p>
                    • <span className="font-medium text-green-600">Đang kích hoạt</span>: Bạn đã mua và có thể truy cập
                    khóa tập
                  </p>
                  <p>
                    • <span className="font-medium text-red-600">Đã hết hạn</span>: Gói đã mua nhưng đã hết hạn, cần gia
                    hạn
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {course.summary && (
          <div className="bg-primary rounded-xl my-4 p-4 lg:p-5">
            <p className="text-white text-center text-lg lg:text-4xl lg:font-bold font-medium lg:mb-4 mb-1 font-[family-name:var(--font-roboto)]">
              Tóm tắt khoá tập
            </p>
            <div className="xl:px-10 max-lg:w-full mx-auto text-white h-full flex flex-col items-start list-disc pl-5">
              {course.summary.split('\n').map((line: string, index: number) => (
                <div key={index} className="text-[#F7F7F7] text-sm lg:text-xl mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl xl:text-4xl mb-4">
            Thông tin khóa tập
          </p>
          <HTMLRenderer
            content={course.description}
            className="text-[#737373] text-sm lg:text-lg whitespace-pre-line"
          />
        </div>
        {courseEquipments.length > 0 && (
          <div>
            <div className='flex items-center justify-between mb-4'>
              <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl xl:text-4xl">
                Dụng cụ
              </p>
              <Link className='flex gap-2 items-center text-primary' href="/products">
                <ShoppingCart className='size-4' /> Mua dụng cụ
              </Link>
            </div>
            <ScrollArea className="w-screen-max-xl">
              <div className="flex w-max space-x-4 py-4">
                {courseEquipments.map((equipment, index: number) => (
                  <figure key={`equipment-${equipment.id}-${index}`} className="shrink-0">
                    <div className="overflow-hidden rounded-md">
                      <img src={equipment.image} alt={equipment.name} className="w-[168px] h-[175px] object-cover" />
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
        {courseMuscleGroups.length > 0 && (
          <div>
            <p className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl xl:text-4xl mb-4">
              Nhóm cơ
            </p>
            <ScrollArea className="w-screen-max-xl">
              <div className="flex w-max space-x-4 py-4">
                {courseMuscleGroups.map((muscleGroup, index: number) => (
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
      </div>

      <ActionButtons courseID={courseID} enableSave={enableSave} />
    </div>
  )
}

function isActiveSubscription(status: string, endDate: string) {
  const now = new Date()
  const end = new Date(endDate)
  return status === 'active' && end > now
}

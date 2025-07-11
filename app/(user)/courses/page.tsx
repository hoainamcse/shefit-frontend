'use client'

import Layout from '@/app/(user)/_components/layout'
import { MultiSelect } from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { getCourses } from '@/network/client/courses'
import { cn } from '@/lib/utils'
import { courseLevelLabel, courseLevelOptions, courseFormLabel, courseFormOptions } from '@/lib/label'
import type { Course } from '@/models/course'
import { getSubscriptions } from '@/network/client/subscriptions'
import { getUserSubscriptions } from '@/network/client/users'
import type { Subscription } from '@/models/subscription'
import PopularCoursesCarousel from './_components/PopularCoursesCarousel'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'

function MultiSelectHero({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
}) {
  return (
    <MultiSelect
      options={options}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      selectAllLabel="Tất cả"
      maxDisplay={2}
    />
  )
}

const NextButton = ({ className }: { className?: string }) => {
  return (
    <button type="button" className={`bg-background p-2 rounded-3xl text-ring ${className}`}>
      <ChevronRight className="w-4 h-4" />
    </button>
  )
}

export const fetchCache = 'default-no-store'

export default function CoursesPage() {
  const router = useRouter()
  const { session } = useSession()
  const [difficulty, setDifficulty] = useState<string[]>([])
  const [formCategory, setFormCategory] = useState<string[]>([])
  const [subscriptionId, setSubscriptionId] = useState<string[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesZoom, setCoursesZoom] = useState<Course[]>([])
  const [activeTab, setActiveTab] = useState('video')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [showAccessDialog, setShowAccessDialog] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isCheckingAccess, setIsCheckingAccess] = useState(false)

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const subscriptions = await getSubscriptions()
      setSubscriptions(subscriptions.data)
    }
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      const videoCourses = await getCourses({ course_format: 'video' })
      const zoomCourses = await getCourses({ course_format: 'live' })
      setCourses(videoCourses.data)
      setCoursesZoom(zoomCourses.data)
    }
    fetchCourses()
  }, [])

  const checkCourseAccess = (courseId: number, userSubscriptions: UserSubscriptionDetail[]): boolean => {
    return userSubscriptions.some(
      (userSub) => userSub.status === 'active' && userSub.subscription.courses.some((course) => course.id === courseId)
    )
  }

  const handleMembershipClick = async (course: Course) => {
    if (!session?.userId) {
      router.push(`/account?tab=buy-package&course_id=${course.id}`)
      return
    }

    setIsCheckingAccess(true)

    try {
      const userSubscriptions = await getUserSubscriptions(session.userId.toString())
      const hasAccess = checkCourseAccess(course.id, userSubscriptions.data)

      if (hasAccess) {
        setSelectedCourse(course)
        setShowAccessDialog(true)
      } else {
        router.push(`/account?tab=buy-package&course_id=${course.id}`)
      }
    } catch (error) {
      console.error('Error checking course access:', error)
      router.push(`/account?tab=buy-package&course_id=${course.id}`)
    } finally {
      setIsCheckingAccess(false)
    }
  }

  const handleStartCourse = () => {
    if (selectedCourse) {
      const courseType = activeTab === 'video' ? 'video-classes' : 'live-classes'
      router.push(`/courses/${selectedCourse.id}/${courseType}`)
      setShowAccessDialog(false)
      setSelectedCourse(null)
    }
  }

  const filterCourses = (courseList: Course[], onlyFree = false) => {
    return courseList.filter((course) => {
      const matchesDifficulty = difficulty.length === 0 || difficulty.includes(course.difficulty_level)

      const matchesFormCategory =
        formCategory.length === 0 ||
        (Array.isArray(course.form_categories)
          ? course.form_categories.some((cat) => formCategory.includes(cat.name))
          : formCategory.includes(course.form_categories))

      const matchesSubscription =
        subscriptionId.length === 0 ||
        course.subscriptions.some((subscription) => subscriptionId.includes(String(subscription.id)))

      const matchesFree = !onlyFree || course.is_free === true

      return matchesDifficulty && matchesFormCategory && matchesSubscription && matchesFree
    })
  }

  const filteredCourses = filterCourses(courses)
  const filteredCoursesZoom = filterCourses(coursesZoom)
  const filteredFreeVideoCourses = filterCourses(courses, true)
  const filteredFreeZoomCourses = filterCourses(coursesZoom, true)
  const filteredFreeCourses = [...filteredFreeVideoCourses, ...filteredFreeZoomCourses]
  const filteredAllCourses = [...filteredCourses, ...filteredCoursesZoom]

  return (
    <Layout>
      <PopularCoursesCarousel />
      <div className="mx-auto">
        <div className="mx-auto my-12 flex flex-col gap-4">
          <p className="text-center font-[family-name:var(--font-coiny)] font-bold text-ring text-2xl uppercase my-8">
            Tất cả khoá tập
          </p>
          <p className="text-base text-center text-[#737373]">
            Lựa chọn khóa tập phù hợp với kinh nghiệm, mục tiêu và phom dáng của chị để bắt đầu hành trình độ dáng ngay
            hôm nay!
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full justify-center max-w-6xl mx-auto">
            <div className="w-full max-w-lg">
              <MultiSelectHero
                placeholder="Độ khó"
                options={courseLevelOptions}
                value={difficulty}
                onChange={setDifficulty}
              />
            </div>
            <div className="w-full max-w-lg">
              <MultiSelectHero
                placeholder="Phom dáng"
                options={courseFormOptions}
                value={formCategory}
                onChange={setFormCategory}
              />
            </div>
            <div className="w-full max-w-lg">
              <MultiSelectHero
                placeholder="Gói Member"
                options={subscriptions.map((subscription) => ({
                  value: subscription.id.toString(),
                  label: subscription.name,
                }))}
                value={subscriptionId}
                onChange={setSubscriptionId}
              />
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <div className="flex justify-center gap-4 mb-10">
                <TabsList className="bg-white">
                  <TabsTrigger value="all" className={cn('underline text-ring bg-white !shadow-none')}>
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger value="video" className={cn('underline text-ring bg-white !shadow-none')}>
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="live" className={cn('underline text-ring bg-white !shadow-none')}>
                    Zoom
                  </TabsTrigger>
                  <TabsTrigger value="free" className={cn('underline text-ring bg-white !shadow-none')}>
                    Free
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="video">
                <div className="flex flex-wrap gap-6 justify-center">
                  {filteredCourses.map((course) => (
                    <div key={`video-${course.id}`} className="lg:w-[585px] max-w-[585px] w-full overflow-hidden">
                      <div className="relative group">
                        <img
                          src={course.cover_image}
                          alt={course.course_name}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 lg:w-[585px] lg:h-[373px] w-full h-[232px]"
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        <Link href={`/courses/${course.id}/video-classes`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <div className="absolute top-2 right-2 flex justify-end">
                          {course.is_free ? (
                            <Button className="bg-[#DA1515] text-white w-[136px] rounded-full">Free</Button>
                          ) : (
                            <Button
                              className="bg-[#737373] text-white w-[136px] rounded-full"
                              onClick={() => handleMembershipClick(course)}
                              disabled={isCheckingAccess}
                            >
                              {isCheckingAccess ? 'Đang kiểm tra...' : '+ Gói Member'}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{courseLevelLabel[course.difficulty_level]}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="text-gray-500 flex justify-end">
                            {course.form_categories.map((cat) => cat.name).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="live">
                <div className="flex flex-wrap gap-6 justify-center">
                  {filteredCoursesZoom.map((course) => (
                    <div key={`zoom-${course.id}`} className="lg:w-[585px] max-w-[585px] w-full overflow-hidden">
                      <div className="relative group">
                        <img
                          src={course.cover_image}
                          alt={course.course_name}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 lg:w-[585px] lg:h-[373px] w-full h-[232px]"
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        <Link href={`/courses/${course.id}/live-classes`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <div className="absolute top-2 right-2 flex justify-end">
                          {course.is_free ? (
                            <Button className="bg-[#DA1515] text-white w-[136px] rounded-full">Free</Button>
                          ) : (
                            <Button
                              className="bg-[#737373] text-white w-[136px] rounded-full"
                              onClick={() => handleMembershipClick(course)}
                              disabled={isCheckingAccess}
                            >
                              {isCheckingAccess ? 'Đang kiểm tra...' : '+ Gói Member'}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{courseLevelLabel[course.difficulty_level]}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="text-gray-500 flex justify-end">
                            {course.form_categories.map((cat) => cat.name).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="free">
                <div className="flex flex-wrap gap-6 justify-center">
                  {filteredFreeCourses.map((course) => (
                    <div key={`free-${course.id}`} className="lg:w-[585px] max-w-[585px] w-full overflow-hidden">
                      <div className="relative group">
                        <img
                          src={course.cover_image}
                          alt={course.course_name}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 lg:w-[585px] lg:h-[373px] w-full h-[232px]"
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        <Link
                          href={`/courses/${course.id}/${course.course_format === 'video' ? 'video' : 'live'}-classes`}
                        >
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <div className="absolute top-2 right-2 flex justify-end">
                          {course.is_free ? (
                            <Button className="bg-[#DA1515] text-white w-[136px] rounded-full">Free</Button>
                          ) : (
                            <Button
                              className="bg-[#737373] text-white w-[136px] rounded-full"
                              onClick={() => handleMembershipClick(course)}
                              disabled={isCheckingAccess}
                            >
                              {isCheckingAccess ? 'Đang kiểm tra...' : '+ Gói Member'}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{courseLevelLabel[course.difficulty_level]}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="text-gray-500 flex justify-end">
                            {course.form_categories.map((cat) => cat.name).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all">
                <div className="flex flex-wrap gap-6 justify-center">
                  {filteredAllCourses.map((course) => (
                    <div key={`all-${course.id}`} className="lg:w-[585px] max-w-[585px] w-full overflow-hidden">
                      <div className="relative group">
                        <img
                          src={course.cover_image}
                          alt={course.course_name}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 lg:w-[585px] lg:h-[373px] w-full h-[232px]"
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        <Link
                          href={`/courses/${course.id}/${course.course_format === 'video' ? 'video' : 'live'}-classes`}
                        >
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <div className="absolute top-2 right-2 flex justify-end">
                          {course.is_free ? (
                            <Button className="bg-[#DA1515] text-white w-[136px] rounded-full">Free</Button>
                          ) : (
                            <Button
                              className="bg-[#737373] text-white w-[136px] rounded-full"
                              onClick={() => handleMembershipClick(course)}
                              disabled={isCheckingAccess}
                            >
                              {isCheckingAccess ? 'Đang kiểm tra...' : '+ Gói Member'}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{courseLevelLabel[course.difficulty_level]}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div className="text-gray-500 flex justify-end">
                            {course.form_categories.map((cat) => cat.name).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center font-[family-name:var(--font-coiny)] text-[#FF7873] text-xl"></DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-lg text-[#737373] mb-4 ">BẠN ĐÃ MUA GÓI MEMBER CÓ KHÓA TẬP NÀY</p>
          </div>
          <div className="flex gap-4 justify-center w-full px-10">
            <Button className="bg-[#13D8A7] rounded-full w-full text-lg" onClick={() => handleStartCourse()}>
              Bắt đầu học
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

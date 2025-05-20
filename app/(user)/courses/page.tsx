"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Layout from "@/components/common/Layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getCourses } from "@/network/server/courses"
import { cn } from "@/lib/utils"
import {
  DIFFICULTY_LEVEL_OPTIONS,
  FORM_CATEGORY_OPTIONS,
  getFormCategoryLabel,
  getDifficultyLevelLabel,
} from "@/lib/label"
import type { Course, FormCategory } from "@/models/course"
import { getSubscriptions } from "@/network/server/subcriptions"
import type { Subscription } from "@/models/subscriptions"
import PopularCoursesCarousel from "./_components/PopularCoursesCarousel"

function SelectHero({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const NextButton = ({ className }: { className?: string }) => {
  return (
    <button type="button" className={`bg-background p-2 rounded-3xl text-text ${className}`}>
      <ChevronRight className="w-4 h-4" />
    </button>
  )
}

export const fetchCache = "default-no-store"

export default function TrainingCoursesPage() {
  const [difficulty, setDifficulty] = useState("")
  const [formCategory, setFormCategory] = useState("")
  const [subscriptionId, setSubscriptionId] = useState<string | number>("")
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesZoom, setCoursesZoom] = useState<Course[]>([])
  const [activeTab, setActiveTab] = useState("video")
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const subscriptions = await getSubscriptions()
      setSubscriptions(subscriptions.data)
    }
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      const videoCourses = await getCourses("video")
      const zoomCourses = await getCourses("live")
      setCourses(videoCourses.data)
      setCoursesZoom(zoomCourses.data)
    }
    fetchCourses()
  }, [])

  const filterCourses = (courseList: Course[]) => {
    return courseList.filter((course) => {
      const matchesDifficulty = !difficulty || course.difficulty_level === difficulty
      const matchesFormCategory = !formCategory || course.form_categories.includes(formCategory as FormCategory)
      const matchesSubscription =
        !subscriptionId ||
        course.subscriptions.some((subscription) => String(subscription.id) === String(subscriptionId))
      return matchesDifficulty && matchesFormCategory && matchesSubscription
    })
  }

  const filteredCourses = filterCourses(courses)
  const filteredCoursesZoom = filterCourses(coursesZoom)

  return (
    <Layout>
      <PopularCoursesCarousel />
      <div className="max-w-screen-2xl mx-auto">
        <div className="max-w-screen-xl mx-auto my-12 flex flex-col gap-4">
          <p className="text-center font-[family-name:var(--font-coiny)] text-text text-2xl">Tất cả khoá tập</p>
          <p className="text-base text-center text-[#737373]">
            Lựa chọn khóa tập phù hợp với kinh nghiệm, mục tiêu và phom dáng của chị để bắt đầu hành trình độ dáng ngay
            hôm nay!
          </p>
          <div className="flex gap-4">
            <SelectHero
              placeholder="Độ khó"
              options={DIFFICULTY_LEVEL_OPTIONS}
              value={difficulty}
              onChange={setDifficulty}
            />
            <SelectHero
              placeholder="Phom dáng"
              options={FORM_CATEGORY_OPTIONS}
              value={formCategory}
              onChange={setFormCategory}
            />
            <SelectHero
              placeholder="Gói Member"
              options={subscriptions.map((subscription) => ({
                value: subscription.id.toString(),
                label: subscription.name,
              }))}
              value={subscriptionId.toString()}
              onChange={setSubscriptionId}
            />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Tabs defaultValue="video" onValueChange={setActiveTab}>
              <div className="flex justify-center gap-4 mb-10">
                <TabsList className="bg-white">
                  <TabsTrigger value="video" className={cn("underline text-text bg-white !shadow-none")}>
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="live" className={cn("underline text-text bg-white !shadow-none")}>
                    Zoom
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="video">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div key={`video-${course.id}`}>
                      <div className="relative group">
                        <img
                          src={course.cover_image}
                          alt={course.course_name}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                          // width={585}
                          // height={373}
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        {/* <Link href={`/courses/videos/${course.id}`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link> */}

                        <Link href={`/courses/${course.id}/video-classes`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{getDifficultyLevelLabel(course.difficulty_level)}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div className="text-gray-500">
                          {Array.isArray(course.form_categories)
                            ? course.form_categories.map((cat) => getFormCategoryLabel(cat)).join(", ")
                            : getFormCategoryLabel(course.form_categories)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="live">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {filteredCoursesZoom.map((course) => (
                    <div key={`zoom-${course.id}`}>
                      <div className="relative group">
                        <Image
                          src={course.cover_image}
                          alt={course.course_name}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                          width={585}
                          height={373}
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        {/* <Link href={`/courses/live/${course.id}`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link> */}

                        <Link href={`/courses/${course.id}/live-classes`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{getDifficultyLevelLabel(course.difficulty_level)}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div className="text-gray-500">
                          {Array.isArray(course.form_categories)
                            ? course.form_categories.map((cat) => getFormCategoryLabel(cat)).join(", ")
                            : getFormCategoryLabel(course.form_categories)}
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
    </Layout>
  )
}

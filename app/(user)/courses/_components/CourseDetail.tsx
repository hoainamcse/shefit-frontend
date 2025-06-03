"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getCourse } from "@/network/server/courses"
import { getEquipments } from "@/network/server/equipments"
import { getMuscleGroups } from "@/network/server/muscle-groups"
import { formCategoryLabel, difficultyLevelLabel } from '@/lib/label'
import { useState, useEffect, useRef } from "react"
import { DifficultyLevel, FormCategory } from "@/models/course"
import LiveCourseDetail from "./LiveCourseDetail"
import VideoCourseDetail from "./VideoCourseDetail"
import { BackIcon } from "@/components/icons/BackIcon"
import { useRouter } from "next/navigation"
import ActionButtons from "./ActionButtons"
import { Button } from "@/components/ui/button"
import { getSubscriptions } from "@/network/server/subscriptions"
interface CourseDetailProps {
  courseId: string
  typeCourse: "video" | "live"
}

export default function CourseDetail({ courseId, typeCourse }: CourseDetailProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)
  const [course, setCourse] = useState<any>(null)
  const [equipment, setEquipment] = useState<any>(null)
  const [muscleGroup, setMuscleGroup] = useState<any>(null)
  const [subscriptions, setSubscriptions] = useState<any>(null)
  const [isFooterVisible, setIsFooterVisible] = useState(false)

  const footerRef = useRef<HTMLDivElement>(null)

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getCourse(courseId)
        setCourse(courseData)

        const equipmentData = await getEquipments()
        const filteredEquipment = {
          ...equipmentData,
          data: equipmentData.data.filter((eq: any) => courseData.data?.equipment_ids?.includes(eq.id)),
        }
        setEquipment(filteredEquipment)

        const muscleGroupData = await getMuscleGroups()
        const filteredMuscleGroups = {
          ...muscleGroupData,
          data: muscleGroupData.data.filter((mg: any) => courseData.data?.muscle_group_ids?.includes(mg.id)),
        }
        setMuscleGroup(filteredMuscleGroups)

        const subscriptionsData = await getSubscriptions()
        const filteredSubscriptions = {
          ...subscriptionsData,
          data: subscriptionsData.data.filter((sub: any) => courseData.data?.subscription_ids?.includes(sub.id)),
        }
        setSubscriptions(filteredSubscriptions)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [courseId])

  useEffect(() => {
    // Setup intersection observer to detect when footer is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting)
      },
      {
        rootMargin: "0px",
        threshold: 0.1, // When 10% of the footer is visible
      }
    )

    const siteFooter = document.querySelector("footer")

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

  return (
    <div className="flex max-w-screen-2xl mx-auto flex-col gap-10 mt-10 w-full pb-24 relative">
      <div className="p-6 mb-20 flex flex-col gap-10">
        <div className="flex items-center gap-[10px] cursor-pointer" onClick={() => router.back()}>
          <BackIcon color="#000000" style={{ marginBottom: "4px" }} />
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
            <p className="text-[#737373]">{course?.data && difficultyLevelLabel[course.data.difficulty_level as DifficultyLevel]}</p>
            <p className="text-[#737373]">{course?.data?.trainer}</p>
          </div>
          <div className="text-gray-500">
            {course?.data?.form_categories &&
              (Array.isArray(course.data.form_categories)
                ? course.data.form_categories.map((cat: FormCategory) => formCategoryLabel[cat]).join(', ')
                : formCategoryLabel[course.data.form_categories as FormCategory])}
          </div>
        </div>
        {course?.data?.subscription_ids?.length > 0 && (
          <div>
            <div className="font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px]">Gói Member</div>
            <div className="text-[#737373] text-lg">Bạn cần mua các Gói Member sau để truy cập khóa tập</div>
            <div className="flex flex-wrap gap-2 mt-4">
              {subscriptions?.data?.map((subscription: any) => (
                <Button
                  key={subscription.id}
                  variant="default"
                  className="text-lg rounded-full hover:bg-primary/90 w-[136px] bg-[#319F43]"
                >
                  {subscription.name}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="bg-primary rounded-xl my-4 p-4">
          <p className="text-white text-center text-2xl">Tóm tắt khoá tập</p>
          <ul className="text-white list-disc pl-8">
            <li>{course?.data?.description}</li>
          </ul>
        </div>

        {showDetails ? (
          typeCourse === "video" ? (
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
            {equipment?.data?.length > 0 && (
              <div>
                <p className="font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px]">Dụng cụ</p>
                <ScrollArea className="w-screen-max-xl">
                  <div className="flex w-max space-x-4 py-4">
                    {equipment?.data?.map((equipment: any, index: number) => (
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
            {muscleGroup?.data?.length > 0 && (
              <div>
                <p className="font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px]">Nhóm cơ</p>
                <ScrollArea className="w-screen-max-xl">
                  <div className="flex w-max space-x-4 py-4">
                    {muscleGroup?.data?.map((muscleGroup: any, index: number) => (
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

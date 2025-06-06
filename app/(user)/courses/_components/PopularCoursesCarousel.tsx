"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getCoursesByType } from "@/network/server/courses"
import type { Course } from "@/models/course"
import Link from "next/link"
import { courseFormLabel } from "@/lib/label"
export default function PopularCoursesCarousel() {
  const [popularCourses, setPopularCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchPopularCourses = async () => {
      const [videoCourses, liveCourses] = await Promise.all([getCoursesByType("video"), getCoursesByType("live")])

      const allCourses = [...videoCourses.data, ...liveCourses.data]
      const popular = allCourses.filter((course) => course.is_popular)
      setPopularCourses(popular)
    }
    fetchPopularCourses()
  }, [])

  if (popularCourses.length === 0) {
    return null
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <p className="text-center font-[family-name:var(--font-coiny)] text-ring text-2xl my-4">
        Khoá tập hot nhất tháng
      </p>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {popularCourses.map((course) => (
            <CarouselItem key={`popular-course-${course.id}`} className="md:basis-1/2 lg:basis-[22%]">
              <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                <div className="text-center">
                  <div className="relative group">
                    <img
                      src={course.cover_image}
                      alt={course.course_name}
                      className="aspect-[2/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                      width={585}
                      height={373}
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-medium">{course.course_name}</p>
                  <p className="text-[#737373]">
                    {course.form_categories.map((cat) => courseFormLabel[cat]).join(", ")}
                  </p>
                  <p className="text-[#737373]">{course.trainer}</p>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

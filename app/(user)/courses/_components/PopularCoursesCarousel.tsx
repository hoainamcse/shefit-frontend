'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getCourses } from '@/network/client/courses'
import type { Course } from '@/models/course'
import Link from 'next/link'
import { courseFormLabel } from '@/lib/label'
export default function PopularCoursesCarousel() {
  const [popularCourses, setPopularCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchPopularCourses = async () => {
      const [videoCourses, liveCourses] = await Promise.all([
        getCourses({ course_format: 'video' }),
        getCourses({ course_format: 'live' }),
      ])

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
    <div className="mx-auto p-4">
      <p className="lg:text-center font-[family-name:var(--font-coiny)] text-ring text-2xl lg:text-[40px] lg:my-8 my-0 font-bold uppercase mb-4">
        Khoá Tập Hot Nhất Tháng
      </p>
      <div className="mx-auto px-4 lg:px-6">
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent>
            {popularCourses.map((course) => (
              <CarouselItem
                key={`popular-course-${course.id}`}
                className="basis-3/4 md:basis-[37%] lg:basis-[28%] xl:basis-[22%] w-full"
              >
                <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                  <div className="text-center">
                    <img
                      src={course.cover_image}
                      alt={course.course_name}
                      className="object-cover rounded-xl mb-4 aspect-[401/560] w-full"
                    />
                    <p className="font-medium text-base lg:text-xl">{course.course_name}</p>
                    <p className="text-[#737373] text-base lg:text-xl">
                      {course.form_categories.map((cat) => cat.name).join(', ')}
                    </p>
                    <p className="text-[#737373] text-base lg:text-xl">{course.trainer}</p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

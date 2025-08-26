'use client'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useEffect, useState } from 'react'
import { getCourses } from '@/network/client/courses'
import type { Course } from '@/models/course'
import Link from 'next/link'
export default function PopulatedCourses() {
  const [popularCourses, setPopularCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    const fetchPopularCourses = async () => {
      const [videoCourses, liveCourses] = await Promise.all([
        getCourses({ course_format: 'video' }),
        getCourses({ course_format: 'live' }),
      ])

      const allCourses = [...videoCourses.data, ...liveCourses.data]
      const popular = allCourses.filter((course) => course.is_popular)
      setPopularCourses(popular)
      setIsLoading(false)
    }
    fetchPopularCourses()
  }, [])

  if (popularCourses.length === 0) {
    return null
  }

  return (
    <div className="mx-auto mt-0 lg:mt-8">
      <p className="md:text-center font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-ring text-2xl lg:text-4xl lg:my-14 my-4 uppercase">
        Khoá Tập Hot Nhất Tháng
      </p>
      <div className="mx-auto px-8">
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
                <Link href={`/courses/${course.id}`}>
                  <div className="text-center">
                    <img
                      src={course.assets.homepage_thumbnail || course.assets.thumbnail}
                      alt={course.course_name}
                      className="object-cover rounded-xl mb-4 aspect-[401/560] w-full"
                    />
                    <p className="font-medium text-sm lg:text-lg">{course.course_name}</p>
                    <p className="text-[#737373] text-sm lg:text-lg">
                      {course.form_categories.map((cat) => cat.name).join(', ')}
                    </p>
                    <p className="text-[#737373] text-sm lg:text-lg">{course.trainer}</p>
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

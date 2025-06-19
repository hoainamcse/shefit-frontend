'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getCourses } from '@/network/server/courses'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import Link from 'next/link'
import { z } from 'zod'
import { formSchema } from '@/app/(admin)/admin/(content-input)/homepage/schema'

type DataType = z.infer<typeof formSchema>

// Todo: responsive
export function SectionFive({ data }: { data: DataType['section_5'] }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const features = data?.features || []
  const activeFeature = features[activeTabIndex] || null

  if (!features.length) {
    return <div className="text-center py-8">Chưa có dữ liệu hiển thị</div>
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="bg-[#FFF3F3]">
        <div className="container mx-auto py-8 lg:py-12 space-y-8 lg:space-y-10">
          <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center gap-4">
            <h2 className="text-2xl lg:text-3xl font-bold">{data.title}</h2>
            <p className="text-primary">{data.description}</p>
          </div>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-wrap justify-center gap-4">
              {data?.features?.map((feature, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    'flex items-center gap-2 font-medium rounded-md p-2 text-neutral-500 capitalize',
                    activeTabIndex === index && 'bg-background text-primary'
                  )}
                  onClick={() => setActiveTabIndex(index)}
                >
                  <CheckCircle size={20} />
                  {feature.form_category?.name}
                </button>
              ))}
            </div>
            {activeFeature?.description && <p className="text-center">{activeFeature.description}</p>}
          </div>
          <div className="max-w-6xl mx-auto">
            <Carousel>
              <CarouselContent className="flex justify-center">
                {data?.features?.[activeTabIndex]?.courses?.map((course, mIndex) => (
                  <CarouselItem key={course.id} className="basis-4/5 lg:basis-1/4">
                    <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                      <CarouselItem key={course.id} className="basis-2/3 lg:basis-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative w-full overflow-hidden">
                            <img
                              src={course.cover_image || '/temp/homepage-3.jpg'}
                              alt={course.course_name}
                              className="rounded-md w-full object-cover aspect-[5/7]"
                            />
                            <div
                              className={cn(
                                'absolute bottom-[15%] -left-[42px] -right-[42px] h-16 bg-gradient-to-t from-background to-transparent -rotate-12 text-background flex flex-col items-center justify-center',
                                mIndex === 1 && 'bg-primary',
                                mIndex === 2 && 'bg-ring',
                                mIndex === 3 && 'bg-[#B60606]'
                              )}
                            >
                              <p className="uppercase text-sm lg:text-base font-semibold">{course.course_name}</p>
                              <p className="capitalize text-sm lg:text-base">{course.difficulty_level}</p>
                            </div>
                          </div>
                          <p className="text-center text-neutral-500">{course.description}</p>
                        </div>
                      </CarouselItem>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}

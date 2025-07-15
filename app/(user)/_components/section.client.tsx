'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  CustomCarousel,
  CustomCarouselContent,
  CustomCarouselItem,
  CustomCarouselPrevious,
  CustomCarouselNext,
} from '@/components/ui/custom-carousel'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel'
import Link from 'next/link'
import { z } from 'zod'
import { formSchema } from '@/app/(admin)/admin/(content-input)/homepage/schema'

type DataType = z.infer<typeof formSchema>

export function SectionFive({ data }: { data: DataType['section_5'] }) {
  const getMiddleIndex = (length: number) => Math.floor(length / 2)

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(() =>
    data?.video?.courses?.length ? getMiddleIndex(data.video.courses.length) : 0
  )
  const [selectedZoomIndex, setSelectedZoomIndex] = useState(() =>
    data?.zoom?.courses?.length ? getMiddleIndex(data.zoom.courses.length) : 0
  )
  const [videoEmblaApi, setVideoEmblaApi] = useState<any>(null)
  const [zoomEmblaApi, setZoomEmblaApi] = useState<any>(null)

  useEffect(() => {
    if (!videoEmblaApi) return

    const onVideoSelect = () => {
      setSelectedVideoIndex(videoEmblaApi.selectedScrollSnap())
    }

    videoEmblaApi.on('select', onVideoSelect)
    return () => videoEmblaApi.off('select', onVideoSelect)
  }, [videoEmblaApi])

  useEffect(() => {
    if (!zoomEmblaApi) return

    const onZoomSelect = () => {
      setSelectedZoomIndex(zoomEmblaApi.selectedScrollSnap())
    }

    zoomEmblaApi.on('select', onZoomSelect)
    return () => zoomEmblaApi.off('select', onZoomSelect)
  }, [zoomEmblaApi])

  if (!data) {
    return <div className="text-center py-8">Chưa có dữ liệu hiển thị</div>
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="bg-[#FFF3F3] mx-auto">
        <div className="py-8 lg:py-12 space-y-8 lg:space-y-10">
          <div className="max-w-[500px] px-4 lg:px-6 mx-auto flex flex-col items-center justify-center text-center gap-4">
            <h2 dangerouslySetInnerHTML={{ __html: data.title }} className="text-3xl lg:text-[40px] font-bold" />
          </div>

          <div className="mx-auto px-8 lg:px-12">
            <Tabs defaultValue="video" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-transparent shadow-none">
                  <TabsTrigger value="video" className="px-8 text-primary text-lg font-medium rounded-xl">
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="zoom" className="px-8 text-primary text-lg font-medium rounded-xl">
                    Zoom
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="video">
                <div className="mx-auto text-center mb-6">
                  <p className="text-[#FB4A64] text-base lg:text-xl">{data.video?.description}</p>
                </div>
                {data.video?.courses?.length ? (
                  <div className="relative w-full mx-auto py-4">
                    <div className="hidden lg:block">
                      <CustomCarousel setApi={setVideoEmblaApi} className="w-full">
                        <CustomCarouselContent className="items-center">
                          {data.video?.courses?.map((course, index) => {
                            const isSelected = selectedVideoIndex === index
                            return (
                              <CustomCarouselItem key={course.id} index={index} className="px-2">
                                <div className="relative overflow-hidden rounded-lg flex items-center justify-center transition-all duration-300 h-[560px]">
                                  <div
                                    className="relative transition-all duration-300"
                                    style={{
                                      height: isSelected ? '560px' : '400px',
                                      width: isSelected ? '400px' : '250px',
                                    }}
                                  >
                                    <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                                      <div className="absolute inset-0 flex flex-col">
                                        <div className="relative w-full h-full">
                                          <div className="absolute top-5 left-2 w-full h-full ">
                                            <p className="text-white text-lg font-medium uppercase">
                                              Khóa tập luyện với
                                            </p>
                                            <p className="text-white text-[36px] font-semibold uppercase">
                                              {course.form_categories?.[0]?.name}
                                            </p>
                                          </div>
                                          <img
                                            src={course.cover_image}
                                            alt={course.course_name}
                                            className="w-full h-full object-cover rounded-lg"
                                          />
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </CustomCarouselItem>
                            )
                          })}
                        </CustomCarouselContent>
                        <CustomCarouselPrevious />
                        <CustomCarouselNext />
                      </CustomCarousel>
                    </div>
                    <div className="block lg:hidden">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {data.video.courses.map((course: any, index: number) => (
                            <CarouselItem key={course.id || index} className="basis-3/4 md:basis-1/3  lg:basis-full">
                              <div className="relative overflow-hidden rounded-lg">
                                <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                                  <div className="relative">
                                    <div className="relative aspect-[5/7]">
                                      <div className="absolute top-3 left-2 z-10">
                                        <p className="text-white text-sm font-medium uppercase">Khóa tập luyện với</p>
                                        <p className="text-white text-xl font-semibold uppercase">
                                          {course.form_categories?.[0]?.name}
                                        </p>
                                      </div>
                                      <img
                                        src={course.cover_image}
                                        alt={course.course_name}
                                        className="object-cover rounded-lg w-[273px] h-[381px]"
                                      />
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">Chưa có khoá học video</div>
                )}
              </TabsContent>

              <TabsContent value="zoom">
                <div className="mx-auto text-center mb-6">
                  <p className="text-[#FB4A64] text-base lg:text-xl">{data.zoom?.description}</p>
                </div>
                {data.zoom?.courses?.length ? (
                  <div className="relative w-full mx-auto py-4">
                    <div className="hidden lg:block">
                      <CustomCarousel setApi={setZoomEmblaApi} className="w-full">
                        <CustomCarouselContent className="items-center">
                          {data.zoom?.courses?.map((course, index) => {
                            const isSelected = selectedZoomIndex === index
                            return (
                              <CustomCarouselItem key={course.id} index={index} className="px-2">
                                <div className="relative overflow-hidden rounded-lg flex items-center justify-center transition-all duration-300 h-[560px]">
                                  <div
                                    className="relative transition-all duration-300"
                                    style={{
                                      height: isSelected ? '560px' : '400px',
                                      width: isSelected ? '400px' : '250px',
                                    }}
                                  >
                                    <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                                      <div className="absolute inset-0 flex flex-col">
                                        <div className="relative w-full h-full">
                                          <div className="absolute top-5 left-2 w-full h-full ">
                                            <p className="text-white text-lg font-medium uppercase">
                                              Khóa tập luyện với
                                            </p>
                                            <p className="text-white text-[36px] font-semibold uppercase">
                                              {course.form_categories?.[0]?.name}
                                            </p>
                                          </div>
                                          <img
                                            src={course.cover_image}
                                            alt={course.course_name}
                                            className="w-full h-full object-cover rounded-lg"
                                          />
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </CustomCarouselItem>
                            )
                          })}
                        </CustomCarouselContent>
                        <CustomCarouselPrevious />
                        <CustomCarouselNext />
                      </CustomCarousel>
                    </div>
                    <div className="block lg:hidden">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {data.zoom?.courses?.map((course: any, index: number) => (
                            <CarouselItem key={course.id || index} className="basis-3/4 md:basis-1/3  lg:basis-full">
                              <div className="relative overflow-hidden rounded-lg">
                                <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                                  <div className="relative">
                                    <div className="relative aspect-[5/7]">
                                      <div className="absolute top-3 left-2 z-10">
                                        <p className="text-white text-sm font-medium uppercase">Khóa tập luyện với</p>
                                        <p className="text-white text-xl font-semibold uppercase">
                                          {course.form_categories?.[0]?.name}
                                        </p>
                                      </div>
                                      <img
                                        src={course.cover_image}
                                        alt={course.course_name}
                                        className="object-cover rounded-lg w-[273px] h-[381px]"
                                      />
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">Chưa có khoá học zoom</div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SectionSix({ data }: { data: DataType['section_6'] }) {
  const [selectedMethod, setSelectedMethod] = useState(0)

  if (!data || !data.features || !data.features.length) {
    return <div className="text-center py-8">Chưa có dữ liệu hiển thị</div>
  }

  const parsedFeatures = data.features.map((feature: any, index: number) => {
    if (typeof feature === 'string') {
      return {
        id: index.toString(),
        name: feature,
        courses: [],
      }
    }

    if (feature && typeof feature === 'object') {
      const workoutMethod = feature.workout_method || {}
      return {
        id: (workoutMethod.id || index).toString(),
        name: workoutMethod.name || `Workout ${index + 1}`,
        description: feature.description || '',
        courses: Array.isArray(feature.courses) ? feature.courses : [],
      }
    }

    return {
      id: index.toString(),
      name: `Workout ${index + 1}`,
      courses: [],
    }
  })

  const defaultWorkoutMethodId = parsedFeatures[0]?.id || '0'

  const CarouselComponent = ({ feature, methodIndex }: { feature: any; methodIndex: number }) => {
    const [localApi, setLocalApi] = useState<any>(null)
    const [localSelectedIndex, setLocalSelectedIndex] = useState(() =>
      feature.courses?.length ? Math.floor(feature.courses.length / 2) : 0
    )

    useEffect(() => {
      if (!localApi) return

      const onSelect = () => {
        setLocalSelectedIndex(localApi.selectedScrollSnap())
      }

      localApi.on('select', onSelect)
      return () => localApi.off('select', onSelect)
    }, [localApi])

    useEffect(() => {
      if (localApi && selectedMethod === methodIndex && feature.courses?.length) {
        const middleIndex = Math.floor(feature.courses.length / 2)
        setTimeout(() => {
          localApi.scrollTo(middleIndex, false)
          setLocalSelectedIndex(middleIndex)
        }, 100)
      }
    }, [localApi, selectedMethod, methodIndex, feature.courses?.length])

    return (
      <div className="relative w-full mx-auto py-4">
        <div className="hidden lg:block">
          <CustomCarousel setApi={setLocalApi} className="w-full">
            <CustomCarouselContent className="items-center">
              {feature.courses.map((course: any, index: number) => {
                const isSelected = selectedMethod === methodIndex && localSelectedIndex === index
                return (
                  <CustomCarouselItem key={course.id || index} index={index} className="px-2">
                    <div className="relative overflow-hidden rounded-lg flex items-center justify-center transition-all duration-300 h-[560px]">
                      <div
                        className="relative transition-all duration-300"
                        style={{
                          height: isSelected ? '560px' : '400px',
                          width: isSelected ? '400px' : '250px',
                        }}
                      >
                        <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="relative w-full h-full">
                              <div className="absolute top-5 left-2 w-full h-full ">
                                <p className="text-white text-lg font-medium uppercase">Khóa tập luyện với</p>
                                <p className="text-white text-[36px] font-semibold uppercase">
                                  {course.form_categories?.[0]?.name}
                                </p>
                              </div>
                              <img
                                src={course.cover_image}
                                alt={course.course_name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </CustomCarouselItem>
                )
              })}
            </CustomCarouselContent>
            <CustomCarouselPrevious />
            <CustomCarouselNext />
          </CustomCarousel>
        </div>

        <div className="block lg:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {feature.courses.map((course: any, index: number) => (
                <CarouselItem key={course.id || index} className="basis-3/4 md:basis-1/3 lg:basis-full">
                  <div className="relative overflow-hidden rounded-lg">
                    <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                      <div className="relative">
                        <div className="relative aspect-[5/7]">
                          <div className="absolute top-3 left-2 z-10">
                            <p className="text-white text-sm font-medium uppercase">Khóa tập luyện với</p>
                            <p className="text-white text-xl font-semibold uppercase">
                              {course.form_categories?.[0]?.name}
                            </p>
                          </div>
                          <img
                            src={course.cover_image}
                            alt={course.course_name}
                            className="object-cover rounded-lg w-[273px] h-[381px]"
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
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

  return (
    <div className="py-8 lg:py-12">
      <div className="bg-[#DADADA] mx-auto">
        <div className="py-8 lg:py-12 space-y-8 lg:space-y-10">
          <div className="max-w-[500px] mx-auto flex flex-col items-center justify-center text-center gap-4 px-2 lg:px-4">
            <h2 dangerouslySetInnerHTML={{ __html: data.title }} className="text-3xl lg:text-[40px] font-bold px-8" />
          </div>

          <div className="mx-auto px-8 lg:px-12">
            <Tabs defaultValue={defaultWorkoutMethodId} className="w-full">
              {parsedFeatures[selectedMethod]?.description && (
                <div className="mx-auto text-center mb-6">
                  <p
                    dangerouslySetInnerHTML={{ __html: parsedFeatures[selectedMethod].description }}
                    className="text-[#FB4A64] text-base lg:text-xl"
                  />
                </div>
              )}

              <div className="flex justify-center mb-8">
                <TabsList className="bg-transparent shadow-none grid grid-cols-3 lg:grid-cols-5 mb-4">
                  {parsedFeatures.map((feature, index) => (
                    <TabsTrigger
                      key={feature.id || index}
                      value={feature.id || index.toString()}
                      className="px-8 text-primary text-lg font-medium rounded-xl"
                      onClick={() => setSelectedMethod(index)}
                    >
                      {feature.name || `Workout ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {parsedFeatures.map((feature, methodIndex: number) => (
                <TabsContent key={feature.id || methodIndex} value={feature.id || methodIndex.toString()}>
                  {feature.courses?.length ? (
                    <CarouselComponent feature={feature} methodIndex={methodIndex} />
                  ) : (
                    <div className="text-center py-8">Chưa có khoá học cho phương pháp này</div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

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
import { formSchema } from '@/app/(admin)/admin/(configurations)/homepage/schema'
import { HTMLRenderer } from '@/components/html-renderer'
import { getCourses } from '../../../network/client/courses'
import { useQuery } from '@tanstack/react-query'
import { getWorkoutMethods } from '@/network/client/workout-methods'

type DataType = z.infer<typeof formSchema>

export function SectionFive({ data }: { data: DataType['section_5'] }) {
  const getMiddleIndex = (length: number) => Math.floor(length / 2)

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(() =>
    data?.video?.course_ids?.length ? getMiddleIndex(data.video.course_ids.length) : 0
  )
  const [selectedZoomIndex, setSelectedZoomIndex] = useState(() =>
    data?.zoom?.course_ids?.length ? getMiddleIndex(data.zoom.course_ids.length) : 0
  )
  const [videoEmblaApi, setVideoEmblaApi] = useState<any>(null)
  const [zoomEmblaApi, setZoomEmblaApi] = useState<any>(null)

  const videoCourseIds = data.video?.course_ids || []
  const zoomCourseIds = data.zoom?.course_ids || []

  const {
    data: videoCoursesData,
    isLoading: isVideoLoading,
    error: videoError,
    refetch: refetchVideoCourses,
  } = useQuery({
    queryKey: ['videoCourses', videoCourseIds],
    queryFn: () => getCourses({ ids: videoCourseIds.join(','), include_relationships: 'true' }),
    enabled: videoCourseIds.length > 0,
  })

  const {
    data: zoomCoursesData,
    isLoading: isZoomLoading,
    error: zoomError,
    refetch: refetchZoomCourses,
  } = useQuery({
    queryKey: ['zoomCourses', zoomCourseIds],
    queryFn: () => getCourses({ ids: zoomCourseIds.join(','), include_relationships: 'true' }),
    enabled: zoomCourseIds.length > 0,
  })

  // Sync carousel selection indices
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

  // Guard UI states
  if (isVideoLoading || isZoomLoading) {
    return (
      <div className="py-8 lg:py-12 animate-pulse">
        <div className="bg-[#FFF3F3] mx-auto space-y-8 lg:space-y-10">
          <div className="max-w-[500px] px-4 lg:px-6 py-6 mx-auto flex flex-col items-center justify-center text-center gap-4">
            <div className="h-20 bg-gray-200 w-4/5 rounded"></div>
          </div>
          <div className="mx-auto px-8 lg:px-12 !mt-6">
            <div className="flex justify-center mb-8 space-x-4">
              <div className="h-12 w-28 bg-gray-200 rounded-xl"></div>
              <div className="h-12 w-28 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="flex space-x-4 overflow-x-auto py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg w-[250px] h-[400px] flex-shrink-0"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (videoError || zoomError) {
    return <div className="text-center py-8">Error loading courses</div>
  }

  if (!data) {
    return <div className="text-center py-8">Chưa có dữ liệu hiển thị</div>
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="bg-[#FFF3F3] mx-auto">
        <div className="py-16 md:py-12 space-y-8 lg:space-y-10">
          <div className="max-w-[500px] px-4 lg:px-6 mx-auto flex flex-col items-center justify-center text-center gap-4">
            <HTMLRenderer
              content={data.title}
              className="font-[family-name:var(--font-coiny)] text-2xl lg:text-4xl font-bold"
            />
          </div>

          <div className="mx-auto px-8 lg:px-12 !mt-6">
            <Tabs defaultValue="video" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-transparent shadow-none">
                  <TabsTrigger value="video" className="px-8 text-primary text-base font-medium rounded-xl h-10 w-28">
                    Video
                  </TabsTrigger>
                  <TabsTrigger value="zoom" className="px-8 text-primary text-base font-medium rounded-xl h-10 w-28">
                    Zoom
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="video">
                <div className="mx-auto text-center mb-6 lg:w-[70%] xl:w-[50%]">
                  <p className="text-[#FB4A64] text-sm lg:text-lg">{data.video?.description}</p>
                </div>
                {videoCoursesData?.data?.length ? (
                  <div className="relative w-full mx-auto py-4">
                    <div className="hidden lg:block">
                      <CustomCarousel setApi={setVideoEmblaApi} className="w-full">
                        <CustomCarouselContent className="items-center">
                          {videoCoursesData?.data?.map((course, index) => {
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
                                    <Link href={`/courses/${course.id}`}>
                                      <div className="absolute inset-0 flex flex-col">
                                        <div className="relative w-full h-full">
                                          <img
                                            src={course.assets.homepage_thumbnail || course.assets.thumbnail}
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
                          {videoCoursesData?.data?.map((course: any, index: number) => (
                            <CarouselItem key={course.id || index} className="basis-3/4 md:basis-1/3  lg:basis-full">
                              <div className="relative overflow-hidden rounded-lg">
                                <Link href={`/courses/${course.id}`}>
                                  <div className="relative">
                                    <div className="relative aspect-[273/381]">
                                      <img
                                        src={course.assets.homepage_thumbnail || course.assets.thumbnail}
                                        alt={course.course_name}
                                        className="object-cover rounded-lg w-full h-full"
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
                  <div className="text-center py-8">Chưa có khoá tập video</div>
                )}
              </TabsContent>

              <TabsContent value="zoom">
                <div className="mx-auto text-center mb-6 lg:w-[70%] xl:w-[50%]">
                  <p className="text-[#FB4A64] text-sm lg:text-lg">{data.zoom?.description}</p>
                </div>
                {zoomCoursesData?.data?.length ? (
                  <div className="relative w-full mx-auto py-4">
                    <div className="hidden lg:block">
                      <CustomCarousel setApi={setZoomEmblaApi} className="w-full">
                        <CustomCarouselContent className="items-center">
                          {zoomCoursesData?.data?.map((course, index) => {
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
                                    <Link href={`/courses/${course.id}`}>
                                      <div className="absolute inset-0 flex flex-col">
                                        <div className="relative w-full h-full">
                                          <img
                                            src={course.assets.homepage_thumbnail || course.assets.thumbnail}
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
                          {zoomCoursesData?.data?.map((course: any, index: number) => (
                            <CarouselItem key={course.id || index} className="basis-3/4 md:basis-1/3  lg:basis-full">
                              <div className="relative overflow-hidden rounded-lg">
                                <Link href={`/courses/${course.id}`}>
                                  <div className="relative">
                                    <div className="relative aspect-[273/381]">
                                      <img
                                        src={course.assets.homepage_thumbnail || course.assets.thumbnail}
                                        alt={course.course_name}
                                        className="object-cover rounded-lg w-full h-full"
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
                  <div className="text-center py-8">Chưa có khoá tập zoom</div>
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

  const {
    data: workoutMethodsData,
    isLoading: isWorkoutMethodsLoading,
    error: workoutMethodsError,
    refetch: refetchWorkoutMethods,
  } = useQuery({
    queryKey: ['workout-methods', data],
    queryFn: () => getWorkoutMethods({ ids: data.features.map((feature: any) => feature.workout_method_id).join(',') }),
    enabled: data.features.map((feature: any) => feature.workout_method_id).length > 0,
  })

  // Fetch all courses for the workout methods in one batched request
  const allCourseIds = data.features.flatMap((f: any) => f.course_ids || [])
  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ['section-six-courses', allCourseIds],
    queryFn: () => getCourses({ ids: allCourseIds.join(','), include_relationships: 'true' }),
    enabled: allCourseIds.length > 0,
  })

  // Guard UI states
  if (isWorkoutMethodsLoading || isCoursesLoading) {
    return (
      <div className="py-20 lg:pt-20 lg:pb-40 animate-pulse">
        <div className="bg-[#DADADA] mx-auto">
          <div className="py-16 md:py-12 space-y-8 lg:space-y-10">
            <div className="max-w-[500px] px-4 lg:px-6 mx-auto flex flex-col items-center justify-center text-center gap-4">
              <div className="h-10 bg-gray-300 w-4/5 rounded"></div>
            </div>
            <div className="mx-auto px-8 lg:px-12 mt-6 flex flex-wrap justify-center gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-10 w-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
            <div className="flex space-x-4 overflow-x-auto px-8 lg:px-12 py-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="bg-gray-300 rounded-lg w-[250px] h-[400px] flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (workoutMethodsError || coursesError) {
    return <div className="text-center py-8">Error loading dữ liệu</div>
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
      const workoutMethod = workoutMethodsData?.data.find((method: any) => method.id === feature.workout_method_id)
      return {
        id: (workoutMethod?.id || index).toString(),
        name: workoutMethod?.name || `Workout ${index + 1}`,
        description: feature.description || '',
        courses: coursesData?.data?.filter((c: any) => (feature.course_ids || []).includes(c.id)) || [],
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
                        <Link href={`/courses/${course.id}`}>
                          <div className="absolute inset-0 flex flex-col">
                            <div className="relative w-full h-full">
                              <img
                                src={course.assets.homepage_thumbnail || course.assets.thumbnail}
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
                    <Link href={`/courses/${course.id}`}>
                      <div className="relative">
                        <div className="relative aspect-[273/381]">
                          <img
                            src={course.assets.homepage_thumbnail || course.assets.thumbnail}
                            alt={course.course_name}
                            className="object-cover rounded-lg w-full h-full"
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
    <div className="py-20 lg:pt-20 lg:pb-40">
      <div className="bg-[#DADADA] mx-auto">
        <div className="py-16 md:py-12 space-y-8 lg:space-y-10">
          <div className="max-w-[500px] px-4 lg:px-6 mx-auto flex flex-col items-center justify-center text-center gap-4">
            <HTMLRenderer
              content={data.title}
              className="font-[family-name:var(--font-coiny)] text-2xl lg:text-4xl font-bold"
            />
          </div>

          <div className="mx-auto !mt-6">
            <Tabs defaultValue={defaultWorkoutMethodId} className="w-full">
              <div className="flex justify-center mb-8 md:mb-6">
                <TabsList className="bg-transparent shadow-none flex flex-wrap gap-4 h-auto">
                  {parsedFeatures.map((feature, index) => (
                    <TabsTrigger
                      key={feature.id || index}
                      value={feature.id || index.toString()}
                      className="px-8 text-primary text-base font-medium rounded-xl h-10"
                      onClick={() => setSelectedMethod(index)}
                    >
                      {feature.name || `Workout ${index + 1}`}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {parsedFeatures[selectedMethod]?.description && (
                <div className="mx-auto text-center mb-6 px-8 lg:px-12">
                  <HTMLRenderer
                    content={parsedFeatures[selectedMethod].description}
                    className="text-[#FB4A64] text-sm lg:text-lg whitespace-pre-line"
                  />
                </div>
              )}
              {parsedFeatures.map((feature, methodIndex: number) => (
                <TabsContent
                  className="mx-auto px-8 lg:px-12"
                  key={feature.id || methodIndex}
                  value={feature.id || methodIndex.toString()}
                >
                  {feature.courses?.length ? (
                    <CarouselComponent feature={feature} methodIndex={methodIndex} />
                  ) : (
                    <div className="text-center py-8">Chưa có khoá tập cho phương pháp này</div>
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

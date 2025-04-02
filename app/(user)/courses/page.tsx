import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Layout from "@/components/common/Layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import React from "react"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { getCourses } from "@/network/server/courses"
import { cn } from "@/lib/utils"

function SelectHero({ placeholder }: { placeholder: string }) {
  const data = [
    {
      value: "dress-shirt-striped",
      label: "Striped Dress Shirt",
    },
    {
      value: "relaxed-button-down",
      label: "Relaxed Fit Button Down",
    },
    {
      value: "slim-button-down",
      label: "Slim Fit Button Down",
    },
    {
      value: "dress-shirt-solid",
      label: "Solid Dress Shirt",
    },
    {
      value: "dress-shirt-check",
      label: "Check Dress Shirt",
    },
  ]

  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
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

export const fetchCache = 'default-no-store'

export default async function TrainingCoursesPage() {
  const courses = await getCourses("video")
  const coursesZoom = await getCourses("live")
  return (
    <Layout>
      <div className="max-w-screen-2xl mx-auto">
        <p className="text-center font-[family-name:var(--font-coiny)] text-text text-2xl my-4">
          Khoá tập hot nhất tháng
        </p>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {Array.from({ length: 12 }).map((_, index) => (
              <CarouselItem key={`menu-${index}`} className="md:basis-1/2 lg:basis-[22%]">
                <div className="text-center">
                  <div className="relative group">
                    <Image
                      src="/temp/VideoCard.jpg"
                      alt="temp/28461621e6ffe301d1ec8b477ebc7c45"
                      className="aspect-[2/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                      width={585}
                      height={373}
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-medium">Easy Slim - Zoom</p>
                  <p className="text-[#737373]">
                    Độ Mông Đào</p>
                  <p className="text-[#737373]">Miss Vi Salano - 4 Tuần</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex gap-6"></div>
      </div>
      <div className="max-w-screen-2xl mx-auto">
        <div className="max-w-screen-xl mx-auto my-12 flex flex-col gap-4">
          <p className="text-center font-[family-name:var(--font-coiny)] text-text text-2xl">Tất cả khoá tập</p>
          <p className="text-base text-center text-[#737373]">
            Lựa chọn khóa tập phù hợp với kinh nghiệm, mục tiêu và phom dáng của chị để bắt đầu hành trình độ dáng ngay
            hôm nay!
          </p>
          <div className="flex gap-4">
            <SelectHero placeholder="Độ khó" />
            <SelectHero placeholder="Phom dáng" />
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Tabs defaultValue="video">
              <div className="flex justify-center gap-4 mb-10">
                <TabsList className="bg-white">
                  <TabsTrigger value="video" className={cn("underline text-text bg-white !shadow-none")}>Video</TabsTrigger>
                  <TabsTrigger value="live" className={cn("underline text-text bg-white !shadow-none")}>Zoom</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="video">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {courses.data.map((course, index) => (
                    <div key={`video-${course.id}`}>
                      <div className="relative group">
                        <Image
                          src={course.cover_image}
                          alt={course.course_name}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                          width={585}
                          height={373}
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                        <Link href={`/courses/videos/${course.id}`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{course.difficulty_level}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div className="text-gray-500">{course.form_categories}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="live">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {coursesZoom.data.map((course, index) => (
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
                        <Link href={`/courses/live/${course.id}`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{course.difficulty_level}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div className="text-gray-500">{course.form_categories}</div>
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

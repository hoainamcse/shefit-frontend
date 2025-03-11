"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Layout from "@/components/common/Layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import Image from "next/image"

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

export default function TrainingCoursesPage() {
  const [isSelected, setIsSelected] = useState("video")

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto">
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
                <div>
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
                  <p className="font-medium">Giảm cân</p>
                  <p className="text-[#737373]">Ăn chay giảm cân</p>
                  <p className="text-[#737373]">Chef Phương Anh - 30 ngày</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex gap-6"></div>
      </div>
      <div className="max-w-screen-xl mx-auto">
        <div className="max-w-screen-lg mx-auto my-12 flex flex-col gap-4">
          <p className="text-center font-[family-name:var(--font-coiny)] text-text text-2xl">Tất cả khoá tập</p>
          <p className="text-base text-center text-[#737373]">
            Lựa chọn khóa tập phù hợp với kinh nghiệm, mục tiêu và phom dáng của chị để bắt đầu hành trình độ dáng ngay
            hôm nay!
          </p>
          <div className="flex gap-4">
            <SelectHero placeholder="Độ khó" />
            <SelectHero placeholder="Phom dáng" />
          </div>
          <div className="flex justify-center gap-4">
            <p
              className={cn("cursor-pointer", isSelected === "video" ? "underline text-text" : "text-[#737373]")}
              onClick={() => setIsSelected("video")}
            >
              Video
            </p>
            <p
              className={cn("cursor-pointer", isSelected === "zoom" ? "underline text-text" : "text-[#737373]")}
              onClick={() => setIsSelected("zoom")}
            >
              Zoom
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={`menu-${index}`}>
              <div className="relative group">
                <Image
                  src="/temp/VideoCard.jpg"
                  alt="temp/5d642fad586a1b35298d7108963b6837"
                  className="aspect-[5/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                  width={585}
                  height={373}
                />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                <Link href={isSelected === "video" ? "training-courses/video" : "training-courses/zoom"}>
                  <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="font-medium">{isSelected === "video" ? "Easy Slim - Video" : "Easy Slim - Zoom"}</p>
              <p className="text-[#737373]">Độ Mông Đào</p>
              <p className="text-[#737373]">Miss Vi Salano - 4 Tuần</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

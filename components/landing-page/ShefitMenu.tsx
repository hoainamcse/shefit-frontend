"use client"

import React from "react"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import EatImage from "@/assets/image/EatImage.png"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowCircle } from "@/components/icons/ArrowCircle"

const images = [EatImage, EatImage, EatImage, EatImage, EatImage]

export default function Menu() {
  return (
    <div className="max-lg:px-5 px-10 text-[40px] max-lg:text-[30px] max-lg:leading-9 leading-[50px] text-[#FF7873] xl:my-40 max-lg:mt-10 font-bold mx-auto text-center bg-white">
      <div>Ăn uống khoa học</div>
      <div className="text-black mb-5">
        “Độ” Dáng Nhanh Hơn Với Menu Theo Từng Mục <br></br> Tiêu Từ Chuyên Gia
      </div>
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="max-lg:basis-[80%] xl:basis-1/3">
              <div className="relative xl:w-[445px] max-lg:w-[294px] xl:h-[352px] max-lg:h-[233px] xl:mx-auto">
                <Image
                  src={images[index % images.length]}
                  alt={`Menu item ${index + 1}`}
                  className="xl:w-[445px] max-lg:w-[294px] xl:h-[352px] max-lg:h-[233px]"
                />
                <div className="absolute flex justify-between items-center w-full bottom-0 p-4 bg-[#28282894] text-white rounded-b-[20px]">
                  <div>Eat clean</div>
                  <ArrowCircle />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Link href={"/menu"}>
        <Button className="bg-[#13D8A7] hover:bg-[#11c296] flex p-4 mt-16 text-xl mx-auto justify-center rounded-[100px] w-[296px]">
          Xem menu
        </Button>
      </Link>
    </div>
  )
}

"use client"

import React from "react"
import Image from "next/image"
import StandImage from "@/assets/image/Stand.png"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Ratings from "./Rating"

const images = [
  StandImage,
  StandImage,
  StandImage,
  StandImage,
  StandImage,
  StandImage,
  StandImage,
  StandImage,
  StandImage,
  StandImage,
  StandImage,
  StandImage,
]

export default function Stand() {
  return (
    <div className="max-lg:mx-5 text-[40px] max-lg:text-[30px] leading-[50px] mt-20 font-bold mx-auto text-center bg-white px-10">
      <span className="text-[#FF7873]">Tiết kiệm 25%</span> với mã <br /> SHEFIT 25
      <div className="text-base max-lg:text-[16px] text-[#737373] xl:w-[856px] max-lg:w-full mx-auto mt-4 mb-5">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
        industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book.
      </div>
      <Carousel
        opts={{
          align: "center",
        }}
        className="w-full"
      >
        <CarouselContent>
          {Array.from({ length: 100 }).map((_, index) => (
            <CarouselItem key={index} className="max-lg:basis-1/2 xl:basis-[11%]">
              <div className="flex gap-2">
                <div className="flex flex-col w-[190px]">
                  <Image src={images[index % images.length]} alt="StandImage" width={190} height={198} />
                  <div className="flex justify-between mt-4 h-5">
                    <Ratings value={2} />
                    <div className="text-[#737373] text-sm font-normal">
                      <span>172</span> reviews
                    </div>
                  </div>
                  <div className="flex flex-col mt-4">
                    <div className="text-lg font-medium flex-start mr-auto">Collagen Gummies</div>
                    <div className="text-sm mr-auto font-normal">Jellybee</div>
                    <div className="text-xl font-semibold text-[#00C7BE] mr-auto">300.000 vnđ</div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <Button className="bg-[#13D8A7] hover:bg-[#11c296] flex p-4 mt-6 text-xl mx-auto justify-center rounded-[100px] w-[296px]">
        Xem giỏ hàng
      </Button>
    </div>
  )
}

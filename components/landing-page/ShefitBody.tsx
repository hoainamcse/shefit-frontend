"use client"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BodyCard from "@/assets/image/BodyCard.png"
import { LockIcon } from "@/components/icons/LockIcon"
import { PearIcon } from "@/components/icons/PearIcon"
import { ClockIcon } from "@/components/icons/ClockIcon"
import { TriangleIcon } from "@/components/icons/TriangleIcon"
import { AppleIcon } from "@/components/icons/AppleIcon"
import { RectangleIcon } from "@/components/icons/RectangleIcon"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export default function Body() {
  return (
    <div className="mb-12 bg-[#FFF3F3] h-[1059px] justify-center text-center flex flex-col">
      <div className="mx-auto w-full">
        <div className="text-[40px] max-lg:text-[30px] max-lg:leading-9 leading-[50px] text-text mt-20 font-bold xl:w-[415px] max-lg:w-full mx-auto">
          <div>
            Tone Body <span className="text-black">chuẩn theo đúng loại phom dáng</span>
          </div>
        </div>
        <div className="text-[20px] max-lg:text-base text-text mt-4 xl:w-[575px] max-lg:w-full mx-auto max-lg:px-5">
          Mỗi loại phom dáng có đặc điểm riêng, việc phối bài tập phù hợp sẽ giúp bạn đạt hiệu quả tối ưu và sở hữu vóc
          dáng cân đối nhất
        </div>
        <Tabs defaultValue="tab1">
          <TabsList className="flex flex-wrap justify-center mt-8 border-none gap-4 md:gap-6 lg:gap-10 bg-[#FFF3F3]">
            <TabsTrigger
              value="tab1"
              className="border-none xl:text-2xl text-base p-2 rounded-[14px] flex items-center justify-center gap-2
    data-[state=active]:text-primary data-[state=active]:bg-white text-[#8E8E93]"
            >
              <PearIcon /> Quả lê
            </TabsTrigger>
            <TabsTrigger
              value="tab2"
              className="border-none xl:text-2xl text-base p-2 rounded-[14px] flex items-center justify-center gap-2
    data-[state=active]:text-primary data-[state=active]:bg-white text-[#8E8E93]"
            >
              <AppleIcon /> Quả táo
            </TabsTrigger>
            <TabsTrigger
              value="tab3"
              className="border-none xl:text-2xl text-base p-2 rounded-[14px] flex items-center justify-center gap-2
    data-[state=active]:text-primary data-[state=active]:bg-white text-[#8E8E93]"
            >
              <RectangleIcon /> Chữ nhật
            </TabsTrigger>
            <TabsTrigger
              value="tab4"
              className="border-none xl:text-2xl text-base p-2 rounded-[14px] flex items-center justify-center gap-2
    data-[state=active]:text-primary data-[state=active]:bg-white text-[#8E8E93]"
            >
              <ClockIcon /> Đồng hồ cát
            </TabsTrigger>
            <TabsTrigger
              value="tab5"
              className="border-none xl:text-2xl text-base p-2 rounded-[14px] flex items-center justify-center gap-2
    data-[state=active]:text-primary data-[state=active]:bg-white text-[#8E8E93]"
            >
              <TriangleIcon /> Tam giác ngược
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 text-2xl w-full">
            <TabsContent value="tab1">
              <p className="text-gray-500 sm:text-gray-500 xl:w-[980px] max-lg:w-full mx-auto xl:text-2xl max-lg:text-base max-lg:px-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book.
              </p>
              <div className="flex w-full mt-4">
                <Carousel opts={{ align: "center" }} className="w-full mx-2">
                  <CarouselContent>
                    {Array.from({ length: 9 }).map((_, index) => (
                      <CarouselItem key={index} className="max-lg:basis-3/4 xl:basis-1/5">
                        <div className="relative mt-4 w-[273px] h-[381px] mx-auto">
                          <Image
                            src={BodyCard}
                            alt="card"
                            width={273}
                            height={381}
                            className="transition duration-300 hover:filter hover:brightness-110 hover:contrast-125"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <p className="text-gray-500 sm:text-gray-500 w-[980px] mx-auto xl:text-2xl max-lg:text-base max-lg:px-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book.
              </p>
            </TabsContent>
            <TabsContent value="tab3">
              <p className="text-gray-500 sm:text-gray-500 w-[980px] mx-auto xl:text-2xl max-lg:text-base max-lg:px-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book.
              </p>
            </TabsContent>
            <TabsContent value="tab4">
              <p className="text-gray-500 sm:text-gray-500 w-[980px] mx-auto xl:text-2xl max-lg:text-base max-lg:px-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book.
              </p>
            </TabsContent>
            <TabsContent value="tab5">
              <p className="text-gray-500 sm:text-gray-500 w-[980px] mx-auto xl:text-2xl max-lg:text-base max-lg:px-2">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

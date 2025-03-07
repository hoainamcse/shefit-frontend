import Image from "next/image"
import { Button } from "@/components/ui/button"
import EducatorAvatar from "@/assets/image/EducatorAvatar.png"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export default function EducatorCard() {
  return (
    <div className="flex w-full mt-4 bg-white">
      <Carousel opts={{ align: "center" }} className="w-full mx-2">
        <CarouselContent>
          {Array.from({ length: 9 }).map((_, index) => (
            <CarouselItem key={index} className="max-lg:basis-1/2 xl:basis-1/4">
              <div className="relative mt-4 w-[273px] max-lg:w-[197px] mx-auto">
                <Image src={EducatorAvatar} alt="EducatorCard" />
                <div className="flex flex-col gap-4 text-center mx-auto text-xl">
                  <div className="font-semibold mt-5">HLV Nam Nguyễn</div>
                  <div className="text-[#8E8E93]">Chuyên kháng lực và định hình đường cong.</div>
                  <Button className="rounded-[26px] text-white text-[26px] bg-[#13D8A7] hover:bg-[#11c296]">Liên hệ</Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

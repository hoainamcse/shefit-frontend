import Image from "next/image"
import MenuDetailImage from "@/assets/image/MenuDetail.png"
import MenuResponsive from "@/assets/image/MenuResponsive.png"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import menuItem from "@/assets/image/menuItem.png"
import { Button } from "@/components/ui/button"
import Header from "@/components/common/Header"
import { BackIcon } from "@/components/icons/BackIcon"
import Link from "next/link"
const images = [menuItem, menuItem, menuItem, menuItem, menuItem]

export default function MenuDetail() {
  return (
    <div>
      <div className="xl:block max-lg:hidden">
        <Header />
      </div>
      <div className="flex flex-col items-center justify-center mt-16 max-lg:mt-0 mx-auto p-10 max-w-screen-3xl mb-20">
        <div className="relative w-full">
          <Link href="/menu" className="absolute top-0 left-0 mt-8 ml-2 xl:hidden max-lg:block hover:bg-transparent focus:bg-transparent active:bg-transparent">
            <Button className="flex items-center gap-2 text-xl bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent">
              <BackIcon /> Quay về
            </Button>
          </Link>
          <Image src={MenuDetailImage} alt="Menu detail image" className="xl:block max-lg:hidden" />
          <Image src={MenuResponsive} alt="Menu detail image" className="xl:hidden max-lg:block" />
        </div>
        <div className="mr-auto text-xl mt-8 max-lg:p-4">
          <p className="font-bold">Giảm cân</p>
          <p className="text-[#737373]">Ăn chay giảm cân</p>
          <p className="text-[#737373]">Chef Phương Anh - 30 ngày</p>
        </div>
        <div className="w-full max-lg:p-4">
          <div className="bg-primary py-12 w-full rounded-[20px] my-20 max-lg:my-2">
            <div className="xl:px-20 max-lg:w-full mx-auto text-white h-full flex flex-col items-center justify-center">
              <ul className="text-[#F7F7F7] text-xl list-disc mr-auto max-lg:px-8">
                <li>Giảm cân</li>
                <li>Chay thanh đạm</li>
                <li>Nhiều rau xanh</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mr-auto text-xl my-20 max-lg:my-0 max-lg:p-4">
          <div className="font-[family-name:var(--font-coiny)] text-text text-[40px] max-lg:text-[30px] mb-5">
            Thông tin thực đơn
          </div>
          <div className="max-lg:text-base">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Ac tempor proin scelerisque proin etiam primis.
            Molestie nascetur justo sit accumsan nunc quam tincidunt blandit. Arcu iaculis risus pulvinar penatibus
            bibendum ad curae consequat.
          </div>
        </div>
        <div className="mr-auto text-xl mt-10 w-full max-lg:p-4">
          <div className="font-[family-name:var(--font-coiny)] text-text text-[40px] max-lg:text-[30px] mb-5">
            Thành phần chính
          </div>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {Array.from({ length: 9 }).map((_, index) => (
                <CarouselItem key={index} className="max-lg:basis-1/3 xl:basis-[11%]">
                  <div>
                    <Image
                      src={images[index % images.length]}
                      alt={`Menu item ${index + 1}`}
                      width={168}
                      height={175}
                    />
                    <div>Supperfruits Gummies</div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
          <Link href="/menu/[detail]/[calendar]" as="/menu/1/1" className="w-full">
            <Button className="w-full rounded-full text-xl bg-button text-white hover:bg-[#11c296] h-14">Bắt đầu</Button>
          </Link>
          <Button className="w-full rounded-full text-xl bg-white text-button h-14 border-2 border-button">Lưu</Button>
        </div>
      </div>
    </div>
  )
}

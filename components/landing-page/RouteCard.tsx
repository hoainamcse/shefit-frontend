import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PersonIcon } from "@/components/icons/PersonIcon"
import { ArrowIcon } from "@/components/icons/ArrowIcon"
import Card from "@/assets/image/Card.png"
import CardMedium from "@/assets/image/CardMedium.png"
import CardHard from "@/assets/image/CardHard.png"

export default function RouteCard() {
  return (
    <div className="xl:flex max-lg:block gap-10 justify-between">
      <div className="xl:w-[464px] max-lg:w-full text-xl text-center">
        <Button className="max-lg:mt-10 bg-[#FFAEB0] hover:bg-[#fca5a6] flex w-full justify-between p-4 rounded-lg">
          <div className="flex items-center">
            <PersonIcon /> <p className="text-xl ml-4">Gói Easy Slim</p>
          </div>
          <div className="flex items-center">
            <p className="text-xl mr-4">Xem thêm</p>
            <ArrowIcon />
          </div>
        </Button>
        <div className="text-[#737373] xl:w-[402px] max-lg:w-full flex flex-col justify-center items-center mx-auto mt-4 max-lg:gap-10">
          <p className="mb-2">
            Cho người mới bắt đầu giảm 2-4kg mỡ/ tháng. Tập luyện nhẹ nhàng, kết hợp chế độ dinh dưỡng khoa học, giúp
            giảm mỡ không mệt mỏi, cắt nét săn chắc
          </p>
          <div className="xl:w-[402px] max-lg:w-full h-[560px] mt-4 mb-5">
            <Image
              src={Card}
              alt="card"
              className="xl:w-[402px] xl:h-[560px] max-lg:h-full max-lg:w-full transition duration-300 hover:filter hover:brightness-110 hover:contrast-125"
            />
          </div>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
      </div>
      <div className="xl:w-[464px] max-lg:w-full text-xl text-center">
        <Button className="max-lg:mt-10 bg-[#FC6363] hover:bg-[#eb7b7b] flex w-full justify-between p-4 rounded-lg">
          <div className="flex items-center">
            <PersonIcon /> <p className="text-xl ml-4">Gói Easy Slim</p>
          </div>
          <div className="flex items-center">
            <p className="text-xl mr-4">Xem thêm</p>
            <ArrowIcon />
          </div>
        </Button>
        <div className="text-[#737373] xl:w-[402px] max-lg:w-full flex flex-col justify-center items-center mx-auto mt-4 max-lg:gap-10">
          <p className="mb-2">
            Cho người mới bắt đầu giảm 2-4kg mỡ/ tháng. Tập luyện nhẹ nhàng, kết hợp chế độ dinh dưỡng khoa học, giúp
            giảm mỡ không mệt mỏi, cắt nét săn chắc
          </p>
          <div className="relative xl:w-[402px] max-lg:w-full h-[560px] mt-4 mb-5">
            <Image
              src={CardMedium}
              alt="card"
              className="xl:w-[402px] xl:h-[560px] max-lg:h-full max-lg:w-full transition duration-300 hover:filter hover:brightness-110 hover:contrast-125"
            />
          </div>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
      </div>
      <div className="xl:w-[464px] max-lg:w-full text-xl text-center">
        <Button className="max-lg:mt-10 bg-[#B60606] hover:bg-[#b60606b7] flex w-full justify-between p-4 rounded-lg">
          <div className="flex items-center">
            <PersonIcon /> <p className="text-xl ml-4">Gói Easy Slim</p>
          </div>
          <div className="flex items-center">
            <p className="text-xl mr-4">Xem thêm</p>
            <ArrowIcon />
          </div>
        </Button>
        <div className="text-[#737373] xl:w-[402px] max-lg:w-full flex flex-col justify-center items-center mx-auto mt-4 max-lg:gap-10">
          <p className="mb-2">
            Cho người mới bắt đầu giảm 2-4kg mỡ/ tháng. Tập luyện nhẹ nhàng, kết hợp chế độ dinh dưỡng khoa học, giúp
            giảm mỡ không mệt mỏi, cắt nét săn chắc
          </p>
          <div className="relative xl:w-[402px] max-lg:w-full h-[560px] mt-4 mb-5">
            <Image
              src={CardHard}
              alt="card"
              className="xl:w-[402px] xl:h-[560px] max-lg:h-full max-lg:w-full transition duration-300 hover:filter hover:brightness-110 hover:contrast-125"
            />
          </div>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
      </div>
    </div>
  )
}

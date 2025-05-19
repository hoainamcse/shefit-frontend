import { CloseIcon } from "@/components/icons/CloseIcon"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import KhoaTapImage from "@/public/temp/VideoCard.jpg"
import ThucDonImage from "@/public/temp/Food.png"
export default async function DetailExercise() {
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Khóa tập của bạn</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={`menu-${index}`} className="text-xl">
              <div className="relative group">
                <Image
                  src={KhoaTapImage}
                  alt=""
                  className="aspect-[5/3] object-cover rounded-xl mb-4"
                  width={585}
                  height={373}
                />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                <div className="absolute top-5 right-5">
                  <Button className="bg-white  text-xl rounded-full size-10">
                    <CloseIcon />
                  </Button>
                </div>
              </div>
              <div className="w-full flex justify-between">
                <div>
                  <p className="font-bold">Easy Slim - Zoom</p>
                  <p className="text-[#737373] font-normal">Độ Mông Đào</p>
                  <p className="text-[#737373] font-normal">Miss Vi Salano - 4 Tuần</p>
                </div>
                <div className="flex flex-col justify-between">
                  <div className="text-[#737373]">Dáng: Quả lê</div>
                  <div className="ml-auto text-primary underline">Bắt đầu</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button className="bg-button text-white text-xl w-full rounded-full h-14 mt-14">Thêm khóa tập</Button>
      </div>
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Thực đơn của bạn</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={`menu-${index}`} className="text-xl">
              <div className="relative group">
                <Image
                  src={ThucDonImage}
                  alt=""
                  className="aspect-[5/3] object-cover rounded-xl mb-4"
                  width={585}
                  height={373}
                />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                <div className="absolute top-5 right-5">
                  <Button className="bg-white  text-xl rounded-full size-10">
                    <CloseIcon />
                  </Button>
                </div>
              </div>
              <div className="w-full flex justify-between">
                <div>
                  <p className="font-bold">Giảm cân</p>
                  <p className="text-[#737373] font-normal">Ăn chay giảm cân</p>
                  <p className="text-[#737373] font-normal">Chef Phương Anh - 30 ngày</p>
                </div>
                <div className="ml-auto text-primary underline">Bắt đầu</div>
              </div>
            </div>
          ))}
        </div>
        <Button className="bg-button text-white text-xl w-full rounded-full h-14 mt-14">Thêm thực đơn</Button>
      </div>
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Bài tập</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={`menu-${index}`} className="text-xl">
              <div className="relative group">
                <Image
                  src={KhoaTapImage}
                  alt=""
                  className="aspect-[5/3] object-cover rounded-xl mb-4"
                  width={585}
                  height={373}
                />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                <div className="absolute top-5 right-5">
                  <Button className="bg-white  text-xl rounded-full size-10">
                    <CloseIcon />
                  </Button>
                </div>
              </div>
              <p className="font-bold">Cơ bụng</p>
            </div>
          ))}
        </div>
        <Button className="bg-button text-white text-xl w-full rounded-full h-14 mt-14">Thêm bài tập</Button>
      </div>
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Món ăn theo chế độ ăn</div>
          <p className="text-[#737373] text-xl">
            Khám phá 500+ món ăn theo các chế độ ăn khác nhau phù hợp nhất với mục tiêu của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={`menu-${index}`} className="text-xl">
              <div className="relative group">
                <Image
                  src={ThucDonImage}
                  alt=""
                  className="aspect-[5/3] object-cover rounded-xl mb-4"
                  width={585}
                  height={373}
                />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              </div>
              <p className="font-bold">Keto</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import ImageTitle from "@/assets/image/ImageTitle.png"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Title() {
  return (
    <div className="relative mb-12">
      <div className="lg:absolute inset-0 bg-gradient-to-r from-transparent to-black sm:hidden lg:block"></div>
      <div className="lg:absolute max-lg:relative lg:top-1/2 lg:left-2/3 max-lg:top-[200px] max-lg:lg-left-0 transform -translate-y-1/2 xl:w-[548px] gap-4 flex flex-col font-bold lg:bg-transparent max-lg:bg-[#FFAEB0] max-lg:w-full max-lg:px-14 lg:px-0 max-lg:h-[400px] max-lg:text-center max-lg:justify-center lg:text-left">
        <p className="xl:text-[40px] xl:leading-[50px] max-lg:leading-9 text-white font-[family-name:var(--font-encode)] max-lg:text-[30px]">
          Độ dáng tại nhà không chỉ là bài tập!
        </p>
        <p className="text-[#FB4A64] xl:text-[20px] max-lg:text-[16px]">
          Rút 3-6kg mỡ/tháng &#8226; Không gầy gộc &#8226; Không vâm đô
        </p>
        <p className="lg:text-[20px] max-lg:text-[16px] text-[#E8E5E5] font-normal">
          Không chỉ là 1000+ bài tập, gói độ dáng
          <span className="text-white"> TONE BODY </span>còn là sự thấu hiểu cơ thể bạn. Shefit xây dựng lộ trình riêng,
          kết hợp dinh dưỡng để có body đẹp hiện đại. Tập ở bất kì đâu, thấy được kết quả hàng tuần!
        </p>
        <div className="w-full">
          <Button className="py-2 px-9 lg:w-[254px] mt-4 rounded-[26px] text-[20px] font-[400] max-lg:text-[16px] max-lg:w-[190px] bg-[#13D8A7] hover:bg-[#11c296]">
            Xem khoá Tone Body
          </Button>
        </div>
      </div>
      <Image src={ImageTitle} alt="title" width={1920} height={833} />
    </div>
  )
}

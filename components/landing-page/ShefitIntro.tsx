import Image from "next/image";
import { Button } from "@/components/ui/button";
import ImageIntro from "@/assets/image/ImageIntro.png";
import { BodyIcon } from "@/components/icons/BodyIcon";
import { DumbbellIcon } from "@/components/icons/DumbbellIcon";
import { CupIcon } from "@/components/icons/CupIcon";
export default function Intro() {
  return (
    <div className="mb-12 bg-white">
      <div className="px-12 max-lg:px-5 flex flex-col gap-10 text-center mb-10">
        <div className="font-bold text-text text-[30px] font-[family-name:var(--font-encode)]">
          Tone Body
        </div>
        <div className="font-bold text-[40px] max-lg:text-[30px]  max-lg:leading-9 font-[family-name:var(--font-encode)]">
          Tại nhà - sao dánh xinh hơn gym?
        </div>
        <div className="text-text text-xl max-lg:text-base font-normal h-[60px] w-[836px] mx-auto max-lg:w-full">
          Hơn 20,000 chị em khắp nơi đã “lột xác” với SHEFIT Tone Body nhờ vào
          lộ trình toàn diện bắt đầu từ các bài phân tích form dáng, cách phối
          bài tập chuyên sâu đến thực đơn khoa học
        </div>
      </div>
      <div className="xl:flex max-lg:block gap-10 items-center justify-between">
        <Image
          src={ImageIntro}
          alt="intro"
          className="xl:w-[1065px] max-lg:w-full max-lg:my-7"
        />
        <div className="max-lg:text-center px-12 max-lg:px-5 flex flex-col gap-10 max-lg:w-full max-lg:justify-center">
          <div className="flex flex-col gap-[16px] max-lg:w-full ">
            <div className="flex item-center max-lg:w-full max-lg:justify-center text-text">
              <BodyIcon className="xl:w-10 xl:h-10 max-lg:w-6 max-lg:h-6" />
              <p className="ml-2 xl:text-[30px] max-lg:text-[18px] leading-[44.4px] font-semibold">
                Giải mã phom dáng từng người
              </p>
            </div>
            <p className="text-[20px] font-normal max-lg:text-[16px]">
              SHEFIT phân tích phom dáng chuyên sâu, xác định chính xác đặc điểm
              cơ thể, tạo nền tảng cho lộ trình &apos;độ&apos; dáng tối ưu.
            </p>
          </div>
          <div className="flex flex-col gap-[16px] max-lg:w-full">
            <div className="flex item-center max-lg:w-full max-lg:justify-center ">
              <DumbbellIcon className="xl:w-10 xl:h-10 max-lg:w-6 max-lg:h-6" />
              <p className="ml-2 xl:text-[30px] max-lg:text-[18px] leading-[44.4px] font-semibold text-text">
                Bí Quyết Tone Body - Phối Hợp Bài Tập Nghệ Thuật
              </p>
            </div>
            <p className="text-[20px] font-normal max-lg:text-[16px]">
              Kết hợp HIIT, LISS, Tabata và kháng lực, cùng các phương pháp
              Circuit, Supersets, AMRAP để cắt nét cơ toàn bộ cơ thể đồng thời
              đốt mỡ hiệu quả.
            </p>
          </div>
          <div className="flex flex-col gap-[16px] max-lg:w-full">
            <div className="flex item-center max-lg:w-full max-lg:justify-center ">
              <CupIcon className="xl:w-10 xl:h-10 max-lg:w-6 max-lg:h-6" />
              <p className="ml-2 xl:text-[30px] leading-[44.4px] font-semibold text-text max-lg:text-[18px]">
                Kế Hoạch Ăn Uống Tối Ưu
              </p>
            </div>
            <p className="text-[20px] font-normal max-lg:text-[16px]">
              Thực đơn từ bác sĩ dinh dưỡng, ngon, đủ chất, không cần ăn kiêng.
              Giảm mỡ, tăng cơ, duy trì vóc dáng bền vững.
            </p>
          </div>
          <div className="w-full flex justify-center">
            <Button className="py-2 px-9 xl:w-[254px] max-lg:w-[190px] mt-4 rounded-[26px] max-lg:text-[16px] xl:text-[20px] font-normal bg-button hover:bg-[#11c296]">
              Xem khoá Tone Body
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

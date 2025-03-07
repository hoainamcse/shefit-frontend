import RouteCard from "./RouteCard"
export default function Route() {
  return (
    <div className="relative my-12 xl:px-32 max-lg:px-2 bg-white">
      <div className="text-center max-lg:w-full xl:mb-12">
        <div className="w-full text-[30px] leading-9 font-bold font-[family-name:var(--font-encode)]">
          Đa dạng lộ trình, tối ưu hiệu quả cho từng mục tiêu
        </div>
        <div className="text-[20px] text-text font-normal h-[60px] xl:w-[966px] max-lg:w-full mx-auto mt-5">
          Từ người chưa tập gì bao giờ đến những ai đã có kinh nghiệm, Gói Tone Body có đủ lộ trình &apos;độ&apos; dáng
          hiệu quả cho tất cả mọi người
        </div>
      </div>
      <RouteCard />
    </div>
  )
}

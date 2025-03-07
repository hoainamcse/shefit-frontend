import Image from "next/image"
import Link from "next/link"

export default async function Gallery() {
  //TODO Use this slug later on for fetching data
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">
            Bài tập theo nhóm cơ
          </div>
          <p className="text-[#737373] text-xl">
            Xem video hướng dẫn chi tiết 1000+ bài đốt mỡ và cắt nét cơ theo từng vùng hình thể nữ giới
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <Link href="/gallery/muscle" key={index}>
              <div key={`menu-${index}`} className="text-xl">
                <div className="relative group">
                  <Image src="/temp/VideoCard.jpg" alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-bold">Cơ bụng</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">
            Món theo chế độ ăn
          </div>
          <p className="text-[#737373] text-xl">
            Khám phá 500+ món ăn theo các chế độ ăn khác nhau phù hợp nhất với mục tiêu của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Array.from({ length: 12 }).map((_, index) => (
            <Link href="/gallery/food" key={index}>
              <div key={`menu-${index}`} className="text-xl">
                <div className="relative group">
                  <Image src="/temp/Food.png" alt="" className="aspect-[5/3] object-cover rounded-xl mb-4" />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-bold">Keto</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

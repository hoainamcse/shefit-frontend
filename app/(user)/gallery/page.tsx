import Link from "next/link"
import { getMuscleGroups } from "@/network/server/muscle-group"
import { getDiets } from "@/network/server/diets"
export const dynamic = "force-dynamic"

export default async function Gallery() {
  const muscleGroups = await getMuscleGroups()
  const diets = await getDiets()
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Bài tập theo nhóm cơ</div>
          <p className="text-[#737373] text-xl">
            Xem video hướng dẫn chi tiết 1000+ bài đốt mỡ và cắt nét cơ theo từng vùng hình thể nữ giới
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {muscleGroups.data.map((muscleGroup) => (
            <Link href={`/gallery/muscle/${muscleGroup.id}`} key={muscleGroup.id}>
              <div key={`menu-${muscleGroup.id}`} className="text-xl">
                <div className="relative group">
                  <img
                    src={muscleGroup.image}
                    alt=""
                    className="aspect-[5/3] object-cover rounded-xl mb-4"
                    width={585}
                    height={373}
                  />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-bold">{muscleGroup.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mb-20">
        <div className="flex flex-col justify-center text-center gap-5 mb-20">
          <div className="font-[family-name:var(--font-coiny)] text-text xl:text-[40px]">Món theo chế độ ăn</div>
          <p className="text-[#737373] text-xl">
            Khám phá 500+ món ăn theo các chế độ ăn khác nhau phù hợp nhất với mục tiêu của bạn.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {diets.data.map((diet) => (
            <Link href={`/gallery/meal/${diet.id}`} key={diet.id}>
              <div key={`menu-${diet.id}`} className="text-xl">
                <div className="relative group">
                  <img
                    src={diet.image}
                    alt=""
                    className="aspect-[5/3] object-cover rounded-xl mb-4"
                    width={585}
                    height={373}
                  />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                </div>
                <p className="font-bold">{diet.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

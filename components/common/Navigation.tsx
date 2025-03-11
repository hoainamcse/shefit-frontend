import Link from "next/link"
import { ExerciseYogaIconGray } from "../icons/ExerciseYogaIconGray"
import { FoodGrainsIconGray } from "../icons/FoodGrainsIconGray"
import { GymIconGray } from "../icons/GymIconGray"
import { AccountIconGray } from "../icons/AccountIconGray"

export default function Navigation() {
  return (
    <div className="flex gap-5 justify-between w-full px-5 py-4">
      <Link href="/training-courses">
        <div className="flex flex-col items-center gap-1">
          <ExerciseYogaIconGray />
          <p className="text-[#8E8E93]">Khóa tập</p>
        </div>
      </Link>
      <Link href="/menu">
        <div className="flex flex-col items-center gap-1">
          <FoodGrainsIconGray />
          <p className="text-[#8E8E93]">Thực đơn</p>
        </div>
      </Link>
      <Link href="/equipment">
        <div className="flex flex-col items-center gap-1">
          <GymIconGray />
          <p className="text-[#8E8E93]">Dụng cụ</p>
        </div>
      </Link>
      <Link href="/account">
        <div className="flex flex-col items-center gap-1">
          <AccountIconGray />
          <p className="text-text">Tài khoản</p>
        </div>
      </Link>
    </div>
  )
}

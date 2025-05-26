import Link from "next/link"
import { ExerciseYogaIconGray } from "../icons/ExerciseYogaIconGray"
import { FoodGrainsIconGray } from "../icons/FoodGrainsIconGray"
import { GymIconGray } from "../icons/GymIconGray"
import { AccountIconGray } from "../icons/AccountIconGray"
import { StarIconGray } from "../icons/StarIconGray"

export default function Navigation() {
  return (
    <div className="flex gap-5 justify-between w-full px-5 py-4 text-sm">
      <Link href="/courses">
        <div className="flex flex-col items-center gap-1">
          <ExerciseYogaIconGray />
          <p className="text-[#8E8E93]">Khóa tập</p>
        </div>
      </Link>
      <Link href="/meal-plans">
        <div className="flex flex-col items-center gap-1">
          <FoodGrainsIconGray />
          <p className="text-[#8E8E93]">Thực đơn</p>
        </div>
      </Link>
      <Link href="/products">
        <div className="flex flex-col items-center gap-1">
          <GymIconGray />
          <p className="text-[#8E8E93]">Sản phẩm</p>
        </div>
      </Link>
      <Link href="#">
        <div className="flex flex-col items-center gap-1">
          <StarIconGray />
          <p className="text-[#8E8E93]">HLV 24/7</p>
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

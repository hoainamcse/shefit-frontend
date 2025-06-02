import Link from 'next/link'

import { ExerciseYogaIconGray } from '@/components/icons/ExerciseYogaIconGray'
import { FoodGrainsIconGray } from '@/components/icons/FoodGrainsIconGray'
import { AccountIconGray } from '@/components/icons/AccountIconGray'
import { GymIconGray } from '@/components/icons/GymIconGray'

export function BottomNavbar() {
  return (
    <div className="bg-background sticky bottom-0 inset-x-0 z-50 lg:hidden">
      <div className="grid grid-cols-4 py-2">
        <Link href="/courses">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <ExerciseYogaIconGray />
            <p>Khóa tập</p>
          </div>
        </Link>
        <Link href="/meal-plans">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <FoodGrainsIconGray />
            <p>Thực đơn</p>
          </div>
        </Link>
        <Link href="/products">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <GymIconGray />
            <p>Sản phẩm</p>
          </div>
        </Link>
        <Link href="/account">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <AccountIconGray />
            <p>Tài khoản</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

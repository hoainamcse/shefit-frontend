'use client'

import Link from 'next/link'

import { GalleryIcon } from '@/components/icons/GalleryIcon'
import { FoodGrainsIcon } from '@/components/icons/FoodGrainsIcon'
import { MemberShipIcon } from '@/components/icons/MemberShipIcon'
import { AccountIconGray } from '@/components/icons/AccountIconGray'
import { ExerciseYogaIcon } from '@/components/icons/ExerciseYogaIcon'
import { useSession } from '@/hooks/use-session'

export function BottomNavbar() {
  const { session } = useSession()

  return (
    <div className="bg-background sticky bottom-0 inset-x-0 z-50 lg:hidden">
      <div className="flex items-center justify-between p-1 pt-2">
        <Link href="/courses">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <ExerciseYogaIcon />
            <p>Khóa tập</p>
          </div>
        </Link>
        <Link href="/meal-plans">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <FoodGrainsIcon />
            <p>Thực đơn</p>
          </div>
        </Link>
        <Link href="/gallery">
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <GalleryIcon />
            <p>Thư viện</p>
          </div>
        </Link>
        <Link href={session ? '/account/packages' : '/packages'}>
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <MemberShipIcon />
            <p>Gói Member</p>
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

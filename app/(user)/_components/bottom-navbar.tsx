'use client'

import Link from 'next/link'

import { ExerciseYogaIconGray } from '@/components/icons/ExerciseYogaIconGray'
import { FoodGrainsIconGray } from '@/components/icons/FoodGrainsIconGray'
import { AccountIconGray } from '@/components/icons/AccountIconGray'
import { GymIconGray } from '@/components/icons/GymIconGray'
import { StarIconGray } from '@/components/icons/StarIconGray'
import { useState } from 'react'
import ChatBot from '@/components/chatbot/chatbot'

export function BottomNavbar() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  return (
    <div className="bg-background sticky bottom-0 inset-x-0 z-50 lg:hidden">
      <div className="grid grid-cols-5 py-2">
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
            <p>Dụng cụ</p>
          </div>
        </Link>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            setIsChatOpen(!isChatOpen)
          }}
        >
          <div className="flex flex-col items-center gap-1 text-neutral-500">
            <StarIconGray />
            <p>HLV 24/7</p>
          </div>
        </Link>
        {isChatOpen && <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
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

'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'
import { getUser } from '@/network/client/users'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { BodyIcon } from '@/components/icons/BodyIcon'
import { CartIcon } from '@/components/icons/cart-icon'
import { PackageBoxIcon } from '@/components/icons/package-box-icon'
import { ProfileCardIcon } from '@/components/icons/profile-card-icon'
import { QuizIcon } from '@/components/icons/quiz-icon'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
const TABS = [
  { value: 'quizzes', label: 'Body Quiz', icon: <QuizIcon /> },
  {
    value: 'resources',
    label: 'Độ dáng',
    icon: <BodyIcon size={20} />,
  },
  {
    value: 'packages',
    label: 'Gói Member',
    icon: <PackageBoxIcon />,
    color: '#FF7873',
    fontWeight: 'bold',
  },
  { value: 'carts', label: 'Giỏ hàng', icon: <CartIcon />, color: '#FF7873' },
  {
    value: 'preferences',
    label: 'Thông tin tài khoản',
    icon: <ProfileCardIcon />,
  },
]

export default function UserGreeting() {
  const pathname = usePathname()
  const tab = pathname.split('/').pop() || 'quizzes'
  const { session } = useSession()

  const { data, isLoading } = useQuery({
    queryKey: ['user', session?.userId],
    queryFn: () => getUser(session?.userId || ''),
    enabled: !!session,
  })

  return (
    <Tabs value={tab} defaultValue="quizzes">
      <div className="lg:pt-8 px-4 lg:px-[56px] pb-8 lg:pb-[80px]">
        <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-[#FF7873] text-2xl lg:text-4xl leading-[33px] lg:leading-[60px] mb-4 md:mb-10">
          {isLoading ? <div>Loading...</div> : `Xin chào ${data?.data.fullname || 'chị'}`}
        </div>
        <TabsList className="w-full lg:w-fit flex-wrap bg-background gap-y-3 sm:gap-y-5 lg:gap-x-7 pl-0 h-fit lg:h-9">
          {TABS.map((tabItem) => (
            <TabsTrigger
              value={tabItem.value}
              className={`h-10 gap-[5px] ${tabItem.color ? `text-[${tabItem.color}]` : ''} ${
                tabItem.fontWeight === 'bold' ? 'font-bold' : ''
              } data-[state=active]:border border-solid border-[#FFAEB0] data-[state=active]:shadow-none data-[state=active]:text-[#FFAEB0] px-2.5 sm:px-3.5 xl:px-[18px]`}
              key={tabItem.value}
              asChild
            >
              <Link href={`/account/${tabItem.value}`}>
                {tabItem.icon}
                <span className="pt-1 text-sm sm:text-lg">{tabItem.label}</span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  )
}

'use client'

import Image from 'next/image'
import { MainButton } from '@/components/buttons/main-button'
import Link from 'next/link'
import { ExerciseYogaIcon } from '@/components/icons/ExerciseYogaIcon'
import { FoodGrainsIcon } from '@/components/icons/FoodGrainsIcon'
import { GymIcon } from '@/components/icons/GymIcon'
import { AccountIcon } from '@/components/icons/AccountIcon'
import { MenuIcon } from '@/components/icons/MenuIcon'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import { GalleryIcon } from '@/components/icons/GalleryIcon'
import { MemberShipIcon } from '@/components/icons/MemberShipIcon'
import { FacebookIcon } from '@/components/icons/FacebookIcon'
import { useSession } from '@/hooks/use-session'
import { signOut } from '@/network/server/auth'
import { useAuthRedirect } from '@/hooks/use-callback-redirect'
import { useState } from 'react'
import { LanguageSelector } from '@/components/language-selector'
import { BusinessIcon } from '@/components/icons/BusinessIcon'
import dynamic from 'next/dynamic'
import { StarIcon } from '@/components/icons/StarIcon'

const ChatBot = dynamic(() => import('@/components/chatbot/chatbot').then((mod) => mod.ChatBot), { ssr: false })

export function Header() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { session } = useSession()
  const { redirectToLogin } = useAuthRedirect()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen)
  }

  const handleSignOut = () => {
    // The signOut server action will handle the redirection
    signOut()
  }

  const authButton = session ? (
    <MainButton
      onClick={handleSignOut}
      className="rounded-full w-32 lg:w-[132px] xl:w-[152px] lg:h-10"
      text="Đăng xuất"
      variant="secondary"
    />
  ) : (
    <MainButton
      className="rounded-full w-32 lg:w-[132px] xl:w-[152px] lg:h-10"
      text="Đăng nhập"
      onClick={() => {
        redirectToLogin()
        setIsSheetOpen(false)
      }}
    />
  )

  const navItems = [
    {
      label: 'Gói Member',
      icon: MemberShipIcon,
      url: '/account?tab=buy-package',
      action: null,
    },
    {
      label: 'Khoá tập',
      icon: ExerciseYogaIcon,
      url: '/courses',
      action: null,
    },
    {
      label: 'Thực đơn',
      icon: FoodGrainsIcon,
      url: '/meal-plans',
      action: null,
    },
    {
      label: 'Dụng cụ',
      icon: GymIcon,
      url: '/products',
      action: null,
    },
    {
      label: 'Thư viện',
      icon: GalleryIcon,
      url: '/gallery',
      action: null,
    },
    {
      label: 'HLV 24/7',
      icon: StarIcon,
      url: '#',
      action: handleChatToggle,
    },
    {
      label: 'Doanh Nghiệp & VIP',
      icon: BusinessIcon,
      url: '#',
      action: null,
    },
    {
      label: 'Tài khoản',
      icon: AccountIcon,
      url: '/account',
      action: null,
    },
  ]

  return (
    <header className="bg-[#FF7873] sticky top-0 inset-x-0 z-50">
      <div className="mx-auto flex justify-between items-center p-3 xl:px-16 lg:px-2">
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo-mono-horizontal.png" alt="logo-mono-horizontal" width={136} height={40} />
        </Link>
        <div className="justify-center items-center gap-2 xl:gap-7 2xl:gap-12 text-background hidden lg:flex">
          {navItems.map((item, index) =>
            item.action ? (
              <button
                key={`navItem-${index}`}
                onClick={item.action}
                className="flex flex-col items-center gap-1 text-background"
              >
                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center">
                  <item.icon />
                </div>
                <span className="whitespace-nowrap text-xs md:text-xs lg:text-base xl:text-lg">{item.label}</span>
              </button>
            ) : (
              <Link key={`navItem-${index}`} href={item.url} className="flex flex-col items-center gap-1">
                <div className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex items-center justify-center">
                  <item.icon />
                </div>
                <span className="whitespace-nowrap text-xs md:text-xs lg:text-base xl:text-lg">{item.label}</span>
              </Link>
            )
          )}
          <LanguageSelector />
          {authButton}
        </div>
        <div className="justify-center items-center gap-2 xl:gap-6 text-background flex lg:hidden">
          {session ? null : (
            <Link href="/auth/login" className="text-white ml-auto px-5 text-base block lg:hidden">
              Đăng nhập
            </Link>
          )}
          <LanguageSelector />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button>
                <MenuIcon />
              </button>
            </SheetTrigger>
            <SheetContent className="max-w-sm">
              <SheetHeader>
                <SheetTitle className="text-ring uppercase text-lg font-bold">Menu</SheetTitle>
                <SheetDescription />
              </SheetHeader>
              <div>
                {navItems.map((item, index) =>
                  item.action ? (
                    <button
                      key={`navItem-${index}`}
                      onClick={() => {
                        item.action()
                        setIsSheetOpen(false)
                      }}
                      className="flex items-center gap-1 mb-3 text-left w-full"
                    >
                      <item.icon />
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      key={`navItem-${index}`}
                      href={item.url}
                      className="flex items-center gap-1 mb-3"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <item.icon />
                      {item.label}
                    </Link>
                  )
                )}
              </div>
              <div className="flex flex-col items-center gap-8 absolute bottom-10 left-1/2 -translate-x-1/2">
                <SheetFooter className="mt-6">{authButton}</SheetFooter>
                <FacebookIcon />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {isChatOpen && <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </header>
  )
}

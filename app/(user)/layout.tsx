'use client'

import { ChatBotButton } from '@/components/chatbot/chatbot'
import { BottomNavbar } from './_components/bottom-navbar'
import { usePathname } from 'next/navigation'

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isLogoutPage = pathname === '/auth/login' || pathname.includes('/auth/login')

  return (
    <div className="overflow-hidden">
      {children}
      {!isLogoutPage && (
        <div className="hidden lg:block">
          <ChatBotButton />
        </div>
      )}
      <BottomNavbar />
    </div>
  )
}

import { ChatBotButton } from '@/components/chatbot/chatbot'
import { BottomNavbar } from './_components/bottom-navbar'

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      {children}
      <ChatBotButton />
      <BottomNavbar />
    </div>
  )
}

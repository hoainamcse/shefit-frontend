import { ChatBotButton } from '@/components/chatbot/chatbot'

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      {children}
      <ChatBotButton />
    </div>
  )
}

import { ChatbotTrigger } from '@/components/chatbot/chatbot'
import { BottomNavbar } from './_components/bottom-navbar'
import { Header } from './_components/header'
import { Footer } from './_components/footer'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main className="relative min-h-screen overflow-hidden">{children}</main>
      <Footer />
      <BottomNavbar />
      <ChatbotTrigger />
    </div>
  )
}

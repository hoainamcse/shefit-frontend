import { Suspense } from 'react'
import UserGreeting from './_components/user-greeting'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-0 max-w-screen-3xl mx-auto mb-20">
      <div className="lg:mt-8 mt-6">
        <UserGreeting />
        <Suspense fallback={<p>Đang tải...</p>}>{children}</Suspense>
      </div>
    </div>
  )
}

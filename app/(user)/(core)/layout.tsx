import { Suspense } from 'react'

export default async function CoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p>Đang tải...</p>}>
      <div className="md:p-8 xl:p-10 max-w-screen-3xl mx-auto mb-20">{children}</div>
    </Suspense>
  )
}

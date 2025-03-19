'use client'

import { MainButton } from '@/components/buttons/main-button'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Đã có lỗi xảy ra</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <MainButton onClick={() => reset()} text="Tải lại trang" />
    </div>
  )
}

'use client'

import { MainButton } from '@/components/buttons/main-button'

export default function Error() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Đã có lỗi xảy ra</h2>
      <p className="text-muted-foreground">Không thể tải danh sách khoá học. Vui lòng thử lại sau.</p>
      <MainButton onClick={() => window.location.reload()} text="Tải lại trang" />
    </div>
  )
}

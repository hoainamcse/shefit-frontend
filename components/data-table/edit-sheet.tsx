import type { PropsWithChildren } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface EditSheetProps extends PropsWithChildren {
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EditSheet({ children, title, description, open, onOpenChange }: EditSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-4">
        <SheetHeader>
          <SheetTitle>{title ?? 'Chỉnh sửa'}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="my-4">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

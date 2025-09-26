import type { PropsWithChildren } from 'react'

import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

interface DialogEditProps extends PropsWithChildren {
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DialogEdit({ children, title, description, open, onOpenChange }: DialogEditProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-5xl max-h-[85vh] h-[85vh]">
        <DialogHeader className="flex-shrink-0 border-b border-dashed p-4 text-left">
          <DialogTitle className="truncate">{title ?? 'Chỉnh sửa'}</DialogTitle>
          {description && <DialogDescription className="truncate">{description}</DialogDescription>}
        </DialogHeader>

        <ScrollArea className="w-full h-full">
          <div className="w-full p-4">{children}</div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

import type { PropsWithChildren } from 'react'

import { ScrollArea } from '../ui/scroll-area'
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
      <DialogContent className="p-0 max-w-5xl max-h-[85vh] h-[85vh] overflow-hidden">
        <div className="flex flex-col h-full w-full overflow-hidden">
          <DialogHeader className="flex-shrink-0 border-b border-dashed p-4 text-left">
            <DialogTitle className="truncate">{title ?? 'Chỉnh sửa'}</DialogTitle>
            {description && <DialogDescription className="truncate">{description}</DialogDescription>}
          </DialogHeader>

          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="w-full h-full overflow-auto">
              <div className="overflow-x-auto p-4">{children}</div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

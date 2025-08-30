import type { PropsWithChildren } from 'react'

import { ScrollArea } from '../ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

interface EditDialogProps extends PropsWithChildren {
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EditDialog({ children, title, description, open, onOpenChange }: EditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-[85vw] max-h-[85vh] w-[85vw] h-[85vh] overflow-hidden">
        <div className="flex flex-col h-full w-full overflow-hidden">
          <DialogHeader className="flex-shrink-0 border-b border-dashed p-4 text-left">
            <DialogTitle className="truncate">{title ?? 'Chỉnh sửa'}</DialogTitle>
            {description && <DialogDescription className="truncate">{description}</DialogDescription>}
          </DialogHeader>

          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="w-full h-full overflow-auto">
              <div className="max-w-full overflow-x-auto p-4">{children}</div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

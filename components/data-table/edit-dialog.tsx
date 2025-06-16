import type { PropsWithChildren } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'

interface EditDialogProps extends PropsWithChildren {
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EditDialog({ children, title, description, open, onOpenChange }: EditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-screen-lg">
        <div className="flex max-h-[90vh] flex-col gap-0">
          <DialogHeader className="flex-none border-b border-dashed p-4 text-left">
            <DialogTitle>{title ?? 'Chỉnh sửa'}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {/* <div className="my-4 flex-1"> */}
          <ScrollArea className="flex-1">
            <div className="p-4">{children}</div>
          </ScrollArea>
          {/* <SheetFooter className="flex-none border-t p-6">Your form submit buttons here</SheetFooter> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

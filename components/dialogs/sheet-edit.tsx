import type { PropsWithChildren } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '../ui/scroll-area'

interface SheetEditProps extends PropsWithChildren {
  title?: string
  description?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SheetEdit({ children, title, description, open, onOpenChange }: SheetEditProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 sm:max-w-3xl">
        <div className="flex h-full w-full flex-col gap-0">
          <SheetHeader className="flex-none border-b border-dashed p-4 text-left">
            <SheetTitle>{title ?? 'Chỉnh sửa'}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {/* <div className="my-4 flex-1"> */}
          <ScrollArea className="flex-1">
            <div className="p-4">{children}</div>
          </ScrollArea>
          {/* <SheetFooter className="flex-none border-t p-6">Your form submit buttons here</SheetFooter> */}
        </div>
      </SheetContent>
    </Sheet>
  )
}

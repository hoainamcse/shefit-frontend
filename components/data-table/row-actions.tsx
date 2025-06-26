import { toast } from 'sonner'
import { useEffect } from 'react'
import { Row } from '@tanstack/react-table'
import { EllipsisIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useClipboard } from '@/hooks/use-clipboard'

interface RowActionsProps<T extends { id: string | number }> {
  row: Row<T>
  onEdit?: (data: T) => void
  onDelete?: (data: T) => void
  onDuplicate?: (data: T) => void
}

export function RowActions<T extends { id: string | number }>({
  row,
  onEdit,
  onDelete,
  onDuplicate,
}: RowActionsProps<T>) {
  const { copy, copied } = useClipboard()

  function onCopy() {
    copy(row.original.id.toString())
  }

  useEffect(() => {
    if (copied) {
      toast.success('Đã sao chép ID vào bộ nhớ tạm')
    }
  }, [copied])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button size="icon" variant="ghost" className="shadow-none" aria-label="Chỉnh sửa mục">
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
            <span>Chỉnh sửa</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopy}>
            <span>Sao chép ID</span>
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          {onDuplicate && (
            <DropdownMenuItem onClick={() => onDuplicate(row.original)}>
              <span>Nhân bản</span>
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete?.(row.original)}>
          <span>Xoá</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

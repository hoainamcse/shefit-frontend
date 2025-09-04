'use client'

import { Trash2, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function DeleteButton({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Button
      type="button"
      variant="destructive"
      size="icon"
      className={cn('rounded-full bg-red-50 hover:bg-red-100 text-red-500', className)}
      onClick={onClick}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}

'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'

export function NextButton({ href, className, onClick }: { href?: string; className?: string; onClick?: () => void }) {
  if (href) {
    return (
      <Link href={href} prefetch={false} className={cn('bg-background p-2 rounded-3xl text-ring', className)}>
        <ChevronRight className="w-4 h-4" />
      </Link>
    )
  }

  return (
    <button type="button" className={cn('bg-background p-2 rounded-3xl text-ring', className)} onClick={onClick}>
      <ChevronRight className="w-4 h-4" />
    </button>
  )
}

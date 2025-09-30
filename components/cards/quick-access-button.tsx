'use client'

import Link from 'next/link'
import { Infinity } from 'lucide-react'

import { cn } from '@/lib/utils'

export function QuickAccessButton({ href, className, onClick }: { href?: string; className?: string; onClick?: () => void }) {
  if (href) {
    return (
      <Link href={href} prefetch={false} className={cn('bg-background p-2 rounded-3xl text-ring', className)}>
        <Infinity className="w-4 h-4" />
      </Link>
    )
  }

  return (
    <button type="button" className={cn('bg-background p-2 rounded-3xl text-ring', className)} onClick={onClick}>
      <Infinity className="w-4 h-4" />
    </button>
  )
}

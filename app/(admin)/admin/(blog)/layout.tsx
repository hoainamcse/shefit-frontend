'use client'
import useRequireRole from '@/hooks/use-require-role'
import React from 'react'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const ready = useRequireRole(['admin'], '/admin')
  if (!ready) return null
  return <>{children}</>
}

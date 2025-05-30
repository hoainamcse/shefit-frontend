'use client'
import { ReactNode } from 'react'
import useRequireRole from '@/hooks/use-require-role'

export default function ContentInputLayout({ children }: { children: ReactNode }) {
  // allow only sub_admin and admin for content-input
  const ready = useRequireRole(['admin'], '/admin')
  if (!ready) return null
  return <>{children}</>
}

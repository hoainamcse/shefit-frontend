'use client'
import useRequireRole from '@/hooks/use-require-role'
import { ReactNode } from 'react'

export default function QuizLayout({ children }: { children: ReactNode }) {
  const ready = useRequireRole(['admin'], '/admin')
  if (!ready) return null
  return <>{children}</>
}

'use client'
import useRequireRole from '@/hooks/use-require-role'

export default function EcomLayout({ children }: { children: React.ReactNode }) {
  const ready = useRequireRole(['admin'], '/admin')
  if (!ready) return null
  return <>{children}</>
}

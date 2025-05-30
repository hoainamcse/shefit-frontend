'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-context'

export default function useRequireRole(
  allowed: Array<'normal_user'|'sub_admin'|'admin'>,
  redirectTo = '/unauthorized'
): boolean {
  const { role, isLoading } = useAuth()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (isLoading) return
    // no session or not in allowed list
    if (!role || !allowed.includes(role)) {
      router.replace(redirectTo)
    } else {
      setReady(true)
    }
  }, [role, isLoading, router, allowed, redirectTo])

  return ready
}
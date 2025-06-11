'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { verifySession } from '@/lib/dal'
import { SessionPayload } from '@/models/auth'

interface SessionContextType {
  session: SessionPayload | null
  status: 'authenticated' | 'unauthenticated' | 'loading'
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<SessionPayload | null>(null)
  const [status, setStatus] = useState<'authenticated' | 'unauthenticated' | 'loading'>('unauthenticated')

  const { data, isLoading, isError } = useQuery({ queryKey: ['session'], queryFn: verifySession })

  useEffect(() => {
    if (isLoading) {
      setStatus('loading')
    } else if (isError) {
      setSession(null)
      setStatus('unauthenticated')
    } else if (data) {
      setSession(data)
      setStatus('authenticated')
    }
  }, [data, isLoading, isError])

  return <SessionContext.Provider value={{ session, status }}>{children}</SessionContext.Provider>
}

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

export const withSession = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <SessionProvider>
      <Component {...props} />
    </SessionProvider>
  )
}

export default SessionProvider

'use client'

import { Suspense } from 'react'
import { Spinner } from '@/components/spinner'

interface SuspenseWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  return (
    <Suspense 
      fallback={
        fallback || (
          <div className="flex items-center justify-center">
            <Spinner className="bg-ring dark:bg-white" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  )
}

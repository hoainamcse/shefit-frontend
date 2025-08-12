'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function GlobalScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Set page position to top immediately (no animation)
    window.scrollTo(0, 0)
    // Also set document scroll position to ensure consistency
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, searchParams])

  // Ensure page starts at top on initial load
  useEffect(() => {
    // Set initial position to top
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    const handleRouteChangeStart = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Listen for custom events that might trigger content changes
    window.addEventListener('routeChangeStart', handleRouteChangeStart)
    
    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart)
    }
  }, [])

  return null
}

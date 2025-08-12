'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollRestoration() {
  const pathname = usePathname()

  useEffect(() => {
    // Always scroll to top when pathname changes (global scroll-to-top)
    window.scrollTo(0, 0)

    // Store scroll position before navigation (for back button restoration)
    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString())
    }

    // Store scroll position when leaving the page
    window.addEventListener('beforeunload', handleBeforeUnload)

    // Store scroll position periodically while on the page (for back button)
    const storeScrollPosition = () => {
      sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString())
    }

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(storeScrollPosition, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [pathname])

  return null
}

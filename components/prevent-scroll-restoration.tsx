'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function PreventScrollRestoration() {
  const pathname = usePathname()
  const previousPath = useRef(pathname)

  useEffect(() => {
    // Disable browser's automatic scroll restoration globally
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
      console.log('Scroll restoration disabled globally')
    }

    // Function to force scroll to top using multiple methods
    const forceScrollToTop = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0

      // Additional attempts with different timing
      setTimeout(() => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      }, 0)

      requestAnimationFrame(() => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
      })
    }

    // Function to clear scroll data from history state
    const clearScrollData = () => {
      if (window.history.state) {
        const cleanState = { ...window.history.state }
        // Remove any scroll-related properties
        delete cleanState.scroll
        delete cleanState.scrollX
        delete cleanState.scrollY

        window.history.replaceState(cleanState, '', window.location.href)
      }
    }

    // Handle browser back/forward navigation (popstate)
    const handlePopState = (event: any) => {
      console.log('Browser back/forward detected, forcing scroll to top')
      clearScrollData()
      forceScrollToTop()

      // Multiple delayed attempts to ensure it works
      setTimeout(forceScrollToTop, 10)
      setTimeout(forceScrollToTop, 50)
      setTimeout(forceScrollToTop, 100)
    }

    // Add popstate event listener with capture phase
    window.addEventListener('popstate', handlePopState, true)

    // Initial setup
    clearScrollData()
    forceScrollToTop()

    return () => {
      window.removeEventListener('popstate', handlePopState, true)
    }
  }, [])

  // Handle pathname changes (App Router navigation)
  useEffect(() => {
    console.log('Path changed from', previousPath.current, 'to', pathname)

    // Clear scroll data and force scroll to top on path change
    if (window.history.state) {
      const cleanState = { ...window.history.state }
      delete cleanState.scroll
      delete cleanState.scrollX
      delete cleanState.scrollY
      window.history.replaceState(cleanState, '', window.location.href)
    }

    // Force scroll to top
    window.scrollTo(0, 0)

    // Additional safety measures
    setTimeout(() => window.scrollTo(0, 0), 0)
    requestAnimationFrame(() => window.scrollTo(0, 0))

    // Update previous path
    previousPath.current = pathname
  }, [pathname])

  return null
}

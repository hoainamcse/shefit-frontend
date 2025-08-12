'use client'

import { useCallback } from 'react'

export function useScrollToTop() {
  const scrollToTop = useCallback((behavior: 'smooth' | 'instant' = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior: behavior
    })
  }, [])

  const scrollToTopInstant = useCallback(() => {
    window.scrollTo(0, 0)
  }, [])

  const scrollToTopSmooth = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return {
    scrollToTop,
    scrollToTopInstant,
    scrollToTopSmooth
  }
}

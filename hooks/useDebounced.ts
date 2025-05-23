import { useRef, useEffect, useCallback } from 'react'

/**
 * Returns a debounced version of the provided function.
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 */
export const useDebounced = <F extends (...args: any[]) => void>(
  fn: F,
  delay: number
): F => {
  const timeoutRef = useRef<number | undefined>(undefined)

  const debouncedFn = useCallback((...args: Parameters<F>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      fn(...args)
    }, delay)
  }, [fn, delay]) as F

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedFn
}

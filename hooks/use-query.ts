import { useState, useEffect, useCallback } from 'react'

interface QueryResult<T> {
  data: T | undefined
  isLoading: boolean
  isRefetching: boolean
  error: Error | null
  refetch: () => Promise<T>
}

interface QueryOptions<T> {
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  onSettled?: (data: T | undefined, error: Error | undefined) => void
}

export function useQuery<T>(queryFn: () => Promise<T>, options: QueryOptions<T> = {}): QueryResult<T> {
  const [data, setData] = useState<T>()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(
    async (isRefetching = false) => {
      try {
        isRefetching ? setIsRefetching(true) : setIsLoading(true)
        const result = await queryFn()
        setData(result)
        setError(null)
        options.onSuccess?.(result)
        options.onSettled?.(result, undefined)
        return result
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e))
        setError(err)
        options.onError?.(err)
        options.onSettled?.(undefined, err)
        throw err
      } finally {
        setIsLoading(false)
        setIsRefetching(false)
      }
    },
    [queryFn, options]
  )

  const refetch = useCallback(() => {
    return fetchData(true)
  }, [fetchData])

  useEffect(() => {
    if (options.enabled === false) {
      setIsLoading(false)
      return
    }
    fetchData()
  }, [options.enabled])

  return { data, isLoading, isRefetching, error, refetch }
}

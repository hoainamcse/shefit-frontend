import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Control, FieldValues, Path } from 'react-hook-form'
import { Loader2, Search } from 'lucide-react'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
  type MultiSelectOption as NyxbMultiSelectOption,
} from '@/components/nyxb-ui/multi-select'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'

// Define our simple option type for API data
export type SelectOption = {
  value: string
  label: string | React.ReactNode
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

export interface PaginatedQueryParams {
  page: number
  per_page: number
  keyword?: string
}

interface FormMultiSelectPaginatedFieldProps<TFieldValues extends FieldValues = FieldValues> {
  form: {
    control: Control<TFieldValues>
    getValues: (name: string) => any
  }
  name: Path<TFieldValues> | string
  label?: string
  withAsterisk?: boolean
  placeholder?: string
  description?: string
  getData: (params: PaginatedQueryParams) => Promise<PaginatedResponse<SelectOption>>
}

const FormMultiSelectPaginatedField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  withAsterisk = false,
  placeholder,
  description,
  getData,
}: FormMultiSelectPaginatedFieldProps<TFieldValues>) => {
  const [keyword, setKeyword] = useState<string | undefined>(undefined)
  const debouncedKeyword = useDebounce(keyword, 500)
  const perPage = 5

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, refetch } = useInfiniteQuery(
    {
      queryKey: [`${name}-options`, debouncedKeyword],
      queryFn: async ({ pageParam }) => {
        const response = await getData({
          page: pageParam as number,
          per_page: perPage,
          keyword: debouncedKeyword,
        })
        return response
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const loadedCount = allPages.length * perPage
        const hasMore = loadedCount < lastPage.total
        return hasMore ? allPages.length : undefined
      },
      staleTime: 5 * 60 * 1000,
    }
  )

  const [isAutoLoadingMore, setIsAutoLoadingMore] = useState(false)

  const allOptions = useMemo(() => {
    if (!data?.pages) return []

    const combinedOptions: NyxbMultiSelectOption[] = []
    const uniqueValues = new Set<string>()

    data.pages.forEach((page) => {
      page.data.forEach((option) => {
        // Only add if the option has a value property and it's not already in our set
        if ('value' in option && !uniqueValues.has(option.value)) {
          uniqueValues.add(option.value)
          combinedOptions.push(option as NyxbMultiSelectOption)
        }
      })
    })

    return combinedOptions
  }, [data?.pages])

  // Effect to handle deep search by auto-fetching more pages
  useEffect(() => {
    if (!debouncedKeyword || debouncedKeyword.trim() === '') {
      setIsAutoLoadingMore(false)
      return
    }

    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      setIsAutoLoadingMore(true)
      fetchNextPage()
    } else if (!hasNextPage) {
      setIsAutoLoadingMore(false)
    }
  }, [debouncedKeyword, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage])

  const filteredOptions = useMemo(() => {
    if (!keyword || keyword.trim() === '') {
      return allOptions
    }

    const searchLower = keyword.toLowerCase()
    return allOptions.filter((option) => {
      // Filter out separator type options
      if ('type' in option && option.type === 'separator') {
        return false
      }

      // Handle group options
      if ('children' in option) {
        return true // Keep groups, they'll be filtered by their children
      }

      // Handle regular options
      if ('value' in option) {
        const label = String(option.label || '').toLowerCase()
        const value = String(option.value || '').toLowerCase()
        return label.includes(searchLower) || value.includes(searchLower)
      }

      return false
    })
  }, [allOptions, keyword])

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget

      const scrollPosition = target.scrollTop + target.clientHeight
      const threshold = target.scrollHeight - 100

      if (scrollPosition >= threshold && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const handleSearch = useCallback((newKeyword?: string) => {
    setKeyword(newKeyword || undefined)
  }, [])

  return (
    <FormField
      control={form.control}
      name={name as Path<TFieldValues>}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {label} {withAsterisk && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <MultiSelect
            onValueChange={field.onChange}
            defaultValue={field.value as string[]}
            onSearch={handleSearch}
            onOpenChange={(open) => {
              if (!open) setKeyword(undefined)
            }}
          >
            <FormControl>
              <MultiSelectTrigger
                className={cn(
                  'w-full',
                  'h-auto min-h-10 py-2 px-4 border border-input/70 hover:border-input transition-colors',
                  'focus-visible:ring-1 focus-visible:ring-primary/30',
                  'shadow-sm hover:shadow'
                )}
              >
                <MultiSelectValue placeholder={placeholder} />
              </MultiSelectTrigger>
            </FormControl>
            <MultiSelectContent className="max-w-[min(calc(100vw-2rem),25rem)] border border-border/70 shadow-lg rounded-lg overflow-hidden">
              {/* Search is moved inside the MultiSelectList for sticky positioning */}
              <MultiSelectSearch
                placeholder={`${placeholder ? placeholder + ' - ' : ''}Search...`}
                className="px-3 border-b border-border/30 sticky top-0 z-10 bg-background/95 backdrop-blur-sm"
              />
              <MultiSelectList
                className="relative min-h-[150px] max-h-[350px] scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent"
                onScroll={handleScroll}
              >
                {/* Search loading indicator: appears at the top when keyword is present and fetching */}
                {keyword && (isLoading || isFetchingNextPage || isAutoLoadingMore) && (
                  <div className="flex items-center justify-center py-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Searching...</span>
                  </div>
                )}

                {/* Initial loading state (no keyword, no options yet) */}
                {isLoading && !keyword && filteredOptions.length === 0 && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary/70" />
                    <span className="text-muted-foreground">Loading options...</span>
                  </div>
                )}

                {/* Render options if available */}
                {filteredOptions.length > 0 && <div className="p-1">{renderMultiSelectOptions(filteredOptions)}</div>}

                {/* No results/options state (only if no options and not currently loading/fetching more) */}
                {!isLoading && !isFetchingNextPage && !isAutoLoadingMore && filteredOptions.length === 0 && (
                  <MultiSelectEmpty>
                    <div className="flex flex-col items-center py-4 text-muted-foreground">
                      <Search className="h-10 w-10 mb-2 text-muted-foreground/50" />
                      <p>{keyword ? 'No results found' : 'No options available'}</p>
                    </div>
                  </MultiSelectEmpty>
                )}

                {/* Load more button / infinite scroll indicator at the bottom */}
                {!keyword && hasNextPage && (
                  <div
                    onClick={handleLoadMore}
                    className="py-3 mt-1 text-xs text-center text-primary cursor-pointer hover:bg-primary/5 transition-colors rounded-md flex items-center justify-center gap-1"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Loading more...</span>
                      </>
                    ) : (
                      <span>Load more options</span>
                    )}
                  </div>
                )}
              </MultiSelectList>
            </MultiSelectContent>
          </MultiSelect>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormMultiSelectPaginatedField }

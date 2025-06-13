import { useState, useCallback, useMemo, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Control, FieldValues, Path } from 'react-hook-form'
import { Loader2, Search, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  renderMultiSelectOptions,
  MultiSelectOptionItem,
} from '@/components/nyxb-ui/multi-select'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'

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
  getData: (params: PaginatedQueryParams) => Promise<PaginatedResponse<MultiSelectOptionItem>>
  initialSelectedOptions?: MultiSelectOptionItem[]
}

const FormMultiSelectPaginatedField = <TFieldValues extends FieldValues>({
  form,
  name,
  label,
  withAsterisk = false,
  placeholder,
  description,
  getData,
  initialSelectedOptions = [],
}: FormMultiSelectPaginatedFieldProps<TFieldValues>) => {
  const [selectedOptions, setSelectedOptions] = useState<MultiSelectOptionItem[]>(initialSelectedOptions)
  const [keyword, setKeyword] = useState<string | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)

  const debouncedKeyword = useDebounce(keyword, 500)
  const perPage = 5

  const [searchResults, setSearchResults] = useState<MultiSelectOptionItem[]>([])
  const [optionsCache, setOptionsCache] = useState<Map<string, MultiSelectOptionItem>>(new Map())

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error, refetch } = useInfiniteQuery(
    {
      queryKey: [`${name}-options`, debouncedKeyword],
      queryFn: async ({ pageParam }) => {
        const response = await getData({
          page: pageParam as number,
          per_page: perPage,
          keyword: debouncedKeyword,
        })

        setOptionsCache((prevCache) => {
          const newCache = new Map(prevCache)
          response.data.forEach((option) => {
            newCache.set(option.value, option)
          })
          return newCache
        })

        if (pageParam === 0) {
          setSearchResults(response.data)
        } else {
          setSearchResults((prev) => [...prev, ...response.data])
        }

        const initialSelectedValues = new Set(initialSelectedOptions.map((opt) => opt.value))
        const filteredData = response.data.filter((item) => !initialSelectedValues.has(item.value))
        return { ...response, data: filteredData }
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

  const paginatedOptions: MultiSelectOptionItem[] = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap((page) => page.data)
  }, [data?.pages])

  const allOptions: MultiSelectOptionItem[] = useMemo(() => {
    const selectedValues = new Set(selectedOptions.map((opt) => opt.value))
    return [...selectedOptions, ...paginatedOptions.filter((opt) => !selectedValues.has(opt.value))]
  }, [selectedOptions, paginatedOptions])

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

  useEffect(() => {
    const currentFormValues = form.getValues(name) as string[] | undefined

    if (!currentFormValues || currentFormValues.length === 0) {
      if (selectedOptions.length > 0) {
        setSelectedOptions([])
      }
      return
    }

    const newSelectedOptions: MultiSelectOptionItem[] = currentFormValues.map((val) => {
      const cachedOption = optionsCache.get(val)
      if (cachedOption) return cachedOption

      const foundInSearch = searchResults.find((opt) => opt.value === val)
      if (foundInSearch) return foundInSearch

      const foundInPaginated = paginatedOptions.find((opt) => opt.value === val)
      if (foundInPaginated) return foundInPaginated

      const foundInSelected = selectedOptions.find((opt) => opt.value === val)
      if (foundInSelected) return foundInSelected

      return { value: val, label: val }
    })

    const areOptionsEqual = (arr1: MultiSelectOptionItem[], arr2: MultiSelectOptionItem[]) => {
      if (arr1.length !== arr2.length) return false
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].value !== arr2[i].value || arr1[i].label !== arr2[i].label) {
          return false
        }
      }
      return true
    }

    if (!areOptionsEqual(selectedOptions, newSelectedOptions)) {
      setSelectedOptions(newSelectedOptions)
    }
  }, [form, name, paginatedOptions, searchResults, optionsCache])

  const filteredOptions = useMemo(() => {
    const selectedSet = new Set(selectedOptions.map((opt) => opt.value))
    if (!keyword || keyword.trim() === '') {
      return [...selectedOptions, ...paginatedOptions.filter((opt) => !selectedSet.has(opt.value))]
    }
    const lower = keyword.toLowerCase()
    return paginatedOptions.filter(
      (opt) => typeof opt.label === 'string' && opt.label.toLowerCase().includes(lower) && !selectedSet.has(opt.value)
    )
  }, [keyword, paginatedOptions, selectedOptions])

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
            value={field.value}
            open={isOpen}
            onOpenChange={(open) => {
              if (!open) {
                const activeElement = document.activeElement
                const isClickOutside = !activeElement?.closest('.multi-select-container')
                if (isClickOutside) {
                  setIsOpen(false)
                  setKeyword(undefined)
                }
              } else {
                setIsOpen(true)
              }
            }}
            onValueChange={(newValues: string[], items: MultiSelectOptionItem[] = []) => {
              if (items.length > 0) {
                setOptionsCache((prevCache) => {
                  const newCache = new Map(prevCache)
                  items.forEach((item) => {
                    if (item.value) {
                      newCache.set(item.value, item)
                    }
                  })
                  return newCache
                })
              }

              const newSelectedOptions: MultiSelectOptionItem[] = newValues.map((val) => {
                const foundInItems = items.find((item) => item.value === val)
                if (foundInItems) return foundInItems

                const cachedOption = optionsCache.get(val)
                if (cachedOption) return cachedOption

                const foundInSearch = searchResults.find((opt) => opt.value === val)
                if (foundInSearch) return foundInSearch

                const foundInFiltered = filteredOptions.find((opt) => opt.value === val)
                if (foundInFiltered) return foundInFiltered

                const foundInSelected = selectedOptions.find((opt) => opt.value === val)
                if (foundInSelected) return foundInSelected

                return { value: val, label: val }
              })

              setSelectedOptions(newSelectedOptions)
              field.onChange(newValues)
              setIsOpen(true)
            }}
            onSearch={handleSearch}
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
                {selectedOptions.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1">
                    {selectedOptions.map((opt) => (
                      <Badge
                        variant="secondary"
                        key={opt.value}
                        className="group/multi-select-badge cursor-pointer rounded-md pr-1.5"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const newSelected = selectedOptions.filter((o) => o.value !== opt.value)
                          setSelectedOptions(newSelected)
                          field.onChange(newSelected.map((o) => o.value))
                        }}
                      >
                        <span className="truncate">{opt.label}</span>
                        <X className="text-muted-foreground group-hover/multi-select-badge:text-foreground ml-1 size-3" />
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground pointer-events-none">{placeholder}</span>
                )}
              </MultiSelectTrigger>
            </FormControl>
            <MultiSelectContent className="max-w-[min(calc(100vw-2rem),25rem)] border border-border/70 shadow-lg rounded-lg overflow-hidden">
              <MultiSelectSearch
                placeholder={`${placeholder ? placeholder + ' - ' : ''}Search...`}
                className="px-3 border-b border-border/30 sticky top-0 z-10 bg-background/95 backdrop-blur-sm"
              />
              <MultiSelectList
                className="relative min-h-[150px] max-h-[350px] scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent"
                onScroll={handleScroll}
              >
                {keyword && (isLoading || isFetchingNextPage || isAutoLoadingMore) && (
                  <div className="flex items-center justify-center py-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Searching...</span>
                  </div>
                )}

                {isLoading && !keyword && filteredOptions.length === 0 && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary/70" />
                    <span className="text-muted-foreground">Loading options...</span>
                  </div>
                )}

                {filteredOptions.length > 0 && <div className="p-1">{renderMultiSelectOptions(filteredOptions)}</div>}

                {!isLoading && !isFetchingNextPage && !isAutoLoadingMore && filteredOptions.length === 0 && (
                  <MultiSelectEmpty>
                    <div className="flex flex-col items-center py-4 text-muted-foreground">
                      <Search className="h-10 w-10 mb-2 text-muted-foreground/50" />
                      <p>{keyword ? 'No results found' : 'No options available'}</p>
                    </div>
                  </MultiSelectEmpty>
                )}

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

'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

import styles from './chatbot.module.css'
import { Greeting } from '@/models/chatbot'
import { useDebounce } from '@/hooks/use-debounce'

interface PromptSuggestionsProps {
  greetings: Greeting[]
  total: number
  isSearching: boolean
  isLoadingMore: boolean
  handleClose: () => void
  onClickPrompt: (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => void
  fetchGreetings: (searchQuery: string, isLoadMore?: boolean) => Promise<void>
}

export default function PromptSuggestions({
  greetings,
  total,
  isSearching,
  isLoadingMore, // I need to hide prompt suggestion buttons when searching, but not when loading more
  handleClose,
  onClickPrompt,
  fetchGreetings,
}: PromptSuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const debouncedQuery = useDebounce(searchQuery, 800)

  // Reset pagination when search query changes
  useEffect(() => {
    if (debouncedQuery !== undefined) {
      fetchGreetings(debouncedQuery, false)
    }
  }, [debouncedQuery])

  const handleLoadMore = async () => {
    await fetchGreetings(debouncedQuery || '', true)
  }

  return (
    <div className='w-full'>
      <Card className='w-full max-w-md mx-auto rounded-sm border-0 bg-background'>
        <CardContent className='p-4 space-y-4'>
          {/* Header with search and close button */}
          <div className='flex items-center gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                type='text'
                placeholder='Những câu hỏi thường gặp...'
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pr-4 py-3 rounded-full border-2 border-primary bg-white/80 backdrop-blur-sm focus:border-primary'
              />
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleClose}
              className='rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-pink-200 hover:border-[2px]'
            >
              <X className='w-5 h-5 text-gray-600' />
            </Button>
          </div>

          {/* Search results info */}
          {debouncedQuery && (
            <div className='text-sm text-gray-600 px-2'>
              {isSearching ? 'Đang tìm kiếm...' : `Tìm thấy ${total} kết quả cho "${debouncedQuery}"`}
            </div>
          )}

          {/* Greeting buttons */}
          <div className={`h-72 overflow-auto ${styles.promptsContainerScrollbar}`}>
            <div className='flex flex-col gap-2 w-[calc(100%-4px)]'>
              {/* Hide buttons when searching, keep them when loading more */}
              {!isSearching &&
                greetings.map((item) => (
                  <Button
                    key={item.id}
                    title={item.message}
                    variant='outline'
                    onClick={() => {
                      onClickPrompt(item.message, true, false)
                      handleClose()
                    }}
                    className='w-full px-4 py-2 rounded-2xl bg-primary hover:bg-primary/85 transition-all duration-200 shadow-sm hover:shadow-md'
                  >
                    <p className='text-gray-800 font-medium text-base w-full overflow-hidden text-ellipsis'>
                      {item.message}
                    </p>
                  </Button>
                ))}
            </div>

            {/* Load more button */}
            {greetings.length < total && !isLoadingMore && !isSearching && greetings.length > 0 && (
              <div className='flex justify-center'>
                <Button onClick={handleLoadMore} variant='ghost' className='text-gray-600'>
                  Xem thêm
                </Button>
              </div>
            )}

            {/* Loading indicator */}
            {(isSearching || isLoadingMore) && (
              <div className='flex justify-center'>
                <div className='animate-spin mt-2 rounded-full h-6 w-6 border-b-2 border-pink-500'></div>
              </div>
            )}

            {/* No more items indicator */}
            {greetings.length === total && greetings.length > 0 && !isSearching && (
              <div className='flex justify-center mt-2'>
                <div className='text-sm text-gray-500 flex items-center'>
                  <ChevronUp className='w-4 h-4 mr-1' />
                  Đã hiển thị tất cả kết quả
                </div>
              </div>
            )}
          </div>

          {/* No results */}
          {greetings.length === 0 && !isSearching && debouncedQuery && (
            <div className='text-center py-8 text-gray-500'>
              <p>Không tìm thấy kết quả nào cho "{debouncedQuery}"</p>
              <p className='text-sm mt-2'>Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

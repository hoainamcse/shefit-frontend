'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChevronUp, Settings, Dumbbell, Utensils, LineChart, MessageCircleQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
  const [activeSection, setActiveSection] = useState<'actions' | 'faq'>('actions')

  // Reset pagination when search query changes
  useEffect(() => {
    if (debouncedQuery !== undefined) {
      fetchGreetings(debouncedQuery, false)
      setActiveSection('faq')
    }
  }, [debouncedQuery])

  const handleLoadMore = async () => {
    await fetchGreetings(debouncedQuery || '', true)
  }

  // Quick action items for "Thao tác" section
  const actionItems = [
    {
      id: 'workout',
      label: 'Lên Khoá Tập',
      icon: <Dumbbell className="h-5 w-5" />,
      message: 'Lên Khoá Tập',
    },
    {
      id: 'meal',
      label: 'Lên Thực Đơn',
      icon: <Utensils className="h-5 w-5" />,
      message: 'Lên Thực Đơn',
    },
    {
      id: 'progress',
      label: 'Theo dõi tiến độ',
      icon: <LineChart className="h-5 w-5" />,
      message: 'Theo dõi tiến độ',
    },
  ]

  return (
    <div className="w-full">
      <Card className="w-full max-w-md mx-auto rounded-sm border-0 bg-background">
        <CardContent className="p-3 space-y-3">
          {/* Header with title, search and close button */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Settings className="text-primary w-5 h-5" />
              <h3 className="font-semibold text-lg">Thao Tác</h3>
            </div>
            <div className="flex-1"></div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-pink-200 hover:border-[2px]"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          {/* Section tabs */}
          <div className={`h-[380px] overflow-auto ${styles.promptsContainerScrollbar}`}>
            {/* Thao tác section */}
            <div className="flex flex-col gap-3 mb-4 p-1">
              {actionItems.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  onClick={() => {
                    onClickPrompt(item.message, true, false)
                    handleClose()
                  }}
                  className="w-full px-4 py-6 rounded-xl bg-primary hover:bg-primary/85 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3 justify-start"
                >
                  <div className="bg-background p-2 rounded-full">{item.icon}</div>
                  <p className="text-gray-800 font-medium text-base">{item.label}</p>
                </Button>
              ))}
            </div>

            <Separator className="my-4" />

            {/* FAQ Section */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircleQuestion className="text-primary w-5 h-5" />
                <h3 className="font-semibold text-lg">Các Câu Hỏi Thường Gặp</h3>
              </div>

              {/* Search bar */}
              <div className="relative mb-4 p-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <Search className="text-primary w-5 h-5" strokeWidth={3} />
                </div>
                <Input
                  type="text"
                  placeholder="Tìm câu hỏi..."
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-4 py-3 pl-10 rounded-full border-2 border-primary bg-white/80 backdrop-blur-sm focus:border-primary"
                />
              </div>

              {/* Search results info */}
              {debouncedQuery && (
                <div className="text-sm text-gray-600 px-2 mb-2">
                  {isSearching ? 'Đang tìm kiếm...' : `Tìm thấy ${total} kết quả cho "${debouncedQuery}"`}
                </div>
              )}

              {/* Greeting buttons */}
              <div className="flex flex-col gap-2 w-[calc(100%-4px)]">
                {/* Hide buttons when searching, keep them when loading more */}
                {!isSearching &&
                  greetings.map((item) => (
                    <Button
                      key={item.id}
                      title={item.message}
                      variant="outline"
                      onClick={() => {
                        onClickPrompt(item.message, true, false)
                        handleClose()
                      }}
                      className="w-full px-4 py-2 rounded-2xl bg-gray-50 hover:bg-gray-100 border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <p className="text-gray-800 font-medium text-base w-full whitespace-nowrap overflow-x-auto md:overflow-hidden md:text-ellipsis [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {item.message}
                      </p>
                    </Button>
                  ))}
              </div>

              {/* Load more button */}
              {greetings.length < total && !isLoadingMore && !isSearching && greetings.length > 0 && (
                <div className="flex justify-center">
                  <Button onClick={handleLoadMore} variant="ghost" className="text-gray-600">
                    Xem thêm
                  </Button>
                </div>
              )}

              {/* Loading indicator */}
              {(isSearching || isLoadingMore) && (
                <div className="flex justify-center">
                  <div className="animate-spin mt-2 rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                </div>
              )}

              {/* No more items indicator */}
              {greetings.length === total && greetings.length > 0 && !isSearching && (
                <div className="flex justify-center mt-2">
                  <div className="text-sm text-gray-500 flex items-center">
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Đã hiển thị tất cả kết quả
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* No results */}
          {greetings.length === 0 && !isSearching && debouncedQuery && (
            <div className="text-center py-8 text-gray-500">
              <p>Không tìm thấy kết quả nào cho "{debouncedQuery}"</p>
              <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

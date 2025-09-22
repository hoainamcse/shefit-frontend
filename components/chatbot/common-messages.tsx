'use client'

import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MessageCircleQuestion, Search, ChevronDown, ChevronUp } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'
import { getGreetings, queryKeyGreetings } from '@/network/client/chatbot'

const PER_PAGE = 10
const MAX_MESSAGE_LENGTH = 100 // Maximum length before truncation

export function CommonMessages({ enable = false, onClick }: { enable?: boolean; onClick?: (message: string) => void }) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set())

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKeyGreetings, { ...(debouncedSearchQuery ? { keyword: debouncedSearchQuery } : {}) }],
    queryFn: async ({ pageParam = 0 }) =>
      getGreetings({
        page: pageParam,
        per_page: PER_PAGE,
        active: true,
        ...(debouncedSearchQuery ? { keyword: debouncedSearchQuery } : {}),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if ((lastPage.paging.page + 1) * lastPage.paging.per_page >= lastPage.paging.total) {
        return undefined
      }
      return lastPageParam + 1
    },
    enabled: enable,
  })

  const messages = data?.pages.flatMap((page) => page.data) || []

  const toggleMessageExpansion = (id: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setExpandedMessages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleMessageClick = (message: string) => {
    if (onClick) {
      onClick(message)
    }
  }

  const truncateMessage = (message: string, id: number) => {
    if (message.length <= MAX_MESSAGE_LENGTH || expandedMessages.has(id)) {
      return message
    }
    return message.substring(0, MAX_MESSAGE_LENGTH) + '...'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageCircleQuestion className="text-primary w-5 h-5" />
        <h3 className="font-medium">Các Câu Hỏi Thường Gặp</h3>
      </div>

      <div className="relative p-1">
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

      <div className="space-y-2">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className="p-3 bg-white/80 rounded-xl hover:bg-white/90 transition-colors cursor-pointer border border-gray-200"
              onClick={() => handleMessageClick(message.message)}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm">{truncateMessage(message.message, message.id)}</p>
                {message.message.length > MAX_MESSAGE_LENGTH && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0 hover:bg-transparent"
                    onClick={(e) => toggleMessageExpansion(message.id, e)}
                  >
                    {expandedMessages.has(message.id) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : status === 'pending' ? (
          <p className="text-center text-gray-500">Đang tải...</p>
        ) : (
          <p className="text-center text-gray-500">Không tìm thấy câu hỏi</p>
        )}

        {hasNextPage && (
          <div className="flex justify-center my-2">
            <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

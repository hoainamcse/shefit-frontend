import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getGreetings } from '@/network/client/chatbot'
import { Greeting } from '@/models/chatbot'
import { useSession } from '@/hooks/use-session'
import { SessionPayload } from '@/models/auth'

const LIMIT_GREETINGS_PER_OFFSET = 10

interface GreetingsPage {
  greetings: Greeting[]
  nextPage: number | null
  total: number
}

export function useChatbotGreetings(session: SessionPayload | null) {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: isLoadingMore,
    isLoading: isLoadingGreetings,
    isError,
  } = useInfiniteQuery({
    queryKey: ['chatbot-greetings', session?.userId, searchQuery],
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) => {
      const params = [
        'active=true',
        `query=${searchQuery}`,
        `per_page=${LIMIT_GREETINGS_PER_OFFSET}`,
        `page=${pageParam}`,
      ]
      const queryString = `?${params.join('&')}`

      const response = await getGreetings(queryString)
      if (response?.status === 'success' && Array.isArray(response.data)) {
        return {
          greetings: response.data,
          nextPage: response.data.length === LIMIT_GREETINGS_PER_OFFSET ? pageParam + 1 : null,
          total: response.paging?.total || 0,
        } as GreetingsPage
      }
      return { greetings: [], nextPage: null, total: 0 } as GreetingsPage
    },
    getNextPageParam: (lastPage: GreetingsPage) => lastPage.nextPage,
    enabled: !!session,
    initialPageParam: 0,
  })

  // Flatten all pages into a single array of greetings
  const greetings = data?.pages.flatMap((page: GreetingsPage) => page.greetings) || []
  const total = data?.pages[0]?.total || 0
  const isFirstFetchGreetingsDone = data !== undefined

  const fetchGreetings = async (newSearchQuery?: string, isLoadMore?: boolean) => {
    if (newSearchQuery !== undefined && newSearchQuery !== searchQuery) {
      setSearchQuery(newSearchQuery)
    } else if (isLoadMore && hasNextPage) {
      await fetchNextPage()
    }
  }

  if (isError) {
    toast.error('Có lỗi khi tải danh sách câu hỏi')
  }

  return {
    greetings,
    isFirstFetchGreetingsDone,
    isLoadingGreetings,
    isLoadingMore,
    total,
    fetchGreetings,
  }
}

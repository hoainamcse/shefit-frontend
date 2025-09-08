import { useState } from 'react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { getConversationHistory } from '@/network/client/chatbot'
import { fetchData } from '@/network/helpers/fetch-data'
import { Message } from '@/models/chatbot'
import { SessionPayload } from '@/models/auth'

const LIMIT_MESSAGES_PER_OFFSET = 10

interface MessagePage {
  messages: Message[]
  nextCursor: string | null
}

export function useChatbotMessages(session: SessionPayload | null) {
  const [isTypingBot, setIsTypingBot] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [idOfMessageGotError, setIdOfMessageGotError] = useState<string>()

  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
    isError: fetchError,
  } = useInfiniteQuery({
    queryKey: ['chatbot-messages', session?.userId],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const params = [`user_id=${session?.userId}`, `limit=${LIMIT_MESSAGES_PER_OFFSET}`, 'order=desc']
      if (pageParam) {
        params.push(`after_id=${pageParam}`)
      }
      const queryString = `?${params.join('&')}`

      const response = await getConversationHistory(queryString)
      if (response?.status === 'success' && Array.isArray(response.data)) {
        const formattedMessages = response.data.map((message: Message) => ({
          ...message,
          created_at: format(new Date(message.created_at), 'dd/MM/yyyy HH:mm'),
          updated_at: format(new Date(message.created_at), 'dd/MM/yyyy HH:mm'),
        }))
        return {
          messages: formattedMessages,
          nextCursor: formattedMessages.length > 0 ? formattedMessages[formattedMessages.length - 1].id : null,
        } as MessagePage
      }
      return { messages: [], nextCursor: null } as MessagePage
    },
    getNextPageParam: (lastPage: MessagePage) => lastPage.nextCursor,
    enabled: !!session?.userId,
    initialPageParam: undefined,
  })

  // Flatten all pages into a single array of messages
  const messages = data?.pages.flatMap((page: MessagePage) => page.messages) || []
  const isFirstFetchDone = data !== undefined

  const generateRandomString = () => {
    let digits = ''
    digits += Math.floor(Math.random() * 9 + 1)
    for (let i = 1; i < 19; i++) {
      digits += Math.floor(Math.random() * 10)
    }
    return digits
  }

  const addMessageToCache = (message: Message) => {
    queryClient.setQueryData(['chatbot-messages', session?.userId], (oldData: any) => {
      if (!oldData) {
        return {
          pages: [{ messages: [message], nextCursor: null }],
          pageParams: [undefined],
        }
      }

      const newPages = [...oldData.pages]
      newPages[0] = {
        ...newPages[0],
        messages: [message, ...newPages[0].messages],
      }

      return {
        ...oldData,
        pages: newPages,
      }
    })
  }

  const sendMessage = async (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => {
    let message = messageValue || ''
    let responseString = ''

    if (isReSend) {
      message = messages[0]?.content
    }

    if (message.trim() && !isTypingBot && session) {
      const currentUserMessageId = generateRandomString()

      if (!isReSend) {
        const newMessage: Message = {
          id: currentUserMessageId,
          role: 'user',
          content: message,
          content_type: 'text',
          created_at: format(new Date(), 'dd/MM/yyyy HH:mm'),
          updated_at: format(new Date(), 'dd/MM/yyyy HH:mm'),
        }
        addMessageToCache(newMessage)
      }

      setIsTypingBot(true)
      setIsLoading(true)
      setIdOfMessageGotError(undefined)

      try {
        if (!session?.userId) {
          throw new Error('User ID is missing')
        }

        const res = await fetchData('/v1/chatbot/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: session.userId,
            message,
          }),
        })

        const reader = res.body?.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunkText = decoder.decode(value, { stream: true })
          buffer += chunkText

          const lines = buffer.split('\n')
          buffer = lines.pop()!

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.replace('data: ', '').trim()
              if (jsonStr === '[DONE]') continue

              try {
                const parsed = JSON.parse(jsonStr)
                const content = parsed.content

                if (content !== undefined) {
                  responseString += content
                }
              } catch (err) {
                console.error('JSON parse error:', err, 'on line:', line)
              }
            }
          }
        }

        const botMessageId = generateRandomString()
        const botResponse: Message = {
          id: botMessageId,
          role: 'assistant',
          content: responseString,
          content_type: 'text',
          created_at: format(new Date(), 'dd/MM/yyyy HH:mm'),
          updated_at: format(new Date(), 'dd/MM/yyyy HH:mm'),
          status: 'is_new',
        }

        addMessageToCache(botResponse)
      } catch (err) {
        console.error('Send message error:', err)
        if (isReSend) {
          setIdOfMessageGotError(messages[0]?.id)
        } else {
          setIdOfMessageGotError(currentUserMessageId)
        }
        toast.error('Xảy ra lỗi khi gửi tin nhắn')
      } finally {
        setIsLoading(false)
        setIsTypingBot(false)
      }
    }

    return { isUsingOption, isReSend }
  }

  return {
    messages,
    isFirstFetchDone,
    isTypingBot,
    isLoading,
    idOfMessageGotError,
    isLoadingMessages,
    fetchError,
    isFetchingNextPage,
    hasNextPage,
    getMessages: fetchNextPage,
    sendMessage,
  }
}

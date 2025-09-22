import type { Message } from '@/models/chatbot'

import { useState, useCallback } from 'react'
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'

import { useSession } from '@/hooks/use-session'
import { fetchData } from '@/network/helpers/fetch-data'
import { getUser, queryKeyUsers } from '@/network/client/users'
import { getConversation, queryKeyConversations } from '@/network/client/chatbot'

const PER_PAGE = 10

export function useChatbot() {
  const { session } = useSession()
  const isAuthenticated = !!session?.userId

  const { data: userData, isLoading } = useQuery({
    queryKey: [queryKeyUsers, session?.userId],
    queryFn: () => getUser(session?.userId!),
    enabled: isAuthenticated,
  })
  const conversationId = userData?.data.conversation_id || null
  const enableChatbot = userData?.data.enable_chatbot || false
  const enableChatbotActions = userData?.data.enable_chatbot_actions || false

  const queryClient = useQueryClient()
  const [sending, setSending] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKeyConversations, conversationId],
    queryFn: async ({ pageParam = 0 }) => getConversation(conversationId!, { page: pageParam, per_page: PER_PAGE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const { page, per_page, total } = lastPage.paging
      return (page + 1) * per_page < total ? lastPageParam + 1 : undefined
    },
    enabled: isAuthenticated && enableChatbot && !!conversationId,
  })

  // Process and sort messages
  const messages = data?.pages.flatMap((page) => page.data) || []
  const sortedMessages = messages.reverse()
  const newestMessage = sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1] : null
  const followUpOptions = newestMessage ? extractOptions(newestMessage.content) : []

  // Helper functions to manipulate message data
  const addMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData([queryKeyConversations, conversationId], (oldData: any) => {
        if (!oldData) {
          return {
            pageParams: [0],
            pages: [
              {
                status: 'success',
                data: [message],
                paging: { page: 0, per_page: PER_PAGE, total: 1 },
              },
            ],
          }
        }

        const newPages = [...oldData.pages]
        newPages[0] = {
          ...newPages[0],
          data: [message, ...newPages[0].data],
          paging: {
            ...newPages[0].paging,
            total: newPages[0].paging.total + 1,
          },
        }

        return { ...oldData, pages: newPages }
      })
    },
    [conversationId, queryClient]
  )

  const updateBotMessage = useCallback(
    (botId: number, content: string) => {
      queryClient.setQueryData([queryKeyConversations, conversationId], (old: any) => {
        if (!old) return old
        const pages = [...old.pages]
        const first = { ...pages[0] }
        first.data = first.data.map((m: Message) => (m.id === botId ? { ...m, content } : m))
        pages[0] = first
        return { ...old, pages }
      })
    },
    [conversationId, queryClient]
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Add user message to the chat
      const userMsg: Message = {
        content,
        content_type: 'text',
        created_at: new Date().toISOString(),
        id: Date.now(),
        role: 'user',
        updated_at: new Date().toISOString(),
      }
      addMessage(userMsg)
      setSending(true)

      try {
        const res = await fetchData('/v1/chatbot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: 1, message: content }),
        })

        const reader = res.body?.getReader()
        if (!reader) {
          throw new Error('Response body stream not available')
        }

        const decoder = new TextDecoder()
        let buffer = ''
        let botText = ''
        let firstChunk = true
        let botId: number | null = null

        while (true) {
          const { value: chunk, done } = await reader.read()
          if (done) break

          if (firstChunk) {
            setSending(false)
            firstChunk = false
          }

          buffer += decoder.decode(chunk, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            const data = line.slice(5).trim()
            if (!data) continue

            try {
              const evt = JSON.parse(data) as { type: string; content?: string }
              if (evt.type === 'chunk' && evt.content) {
                botText += evt.content

                if (botId === null) {
                  // Create new bot message on first chunk
                  botId = Date.now() + 1
                  const botMsg: Message = {
                    id: botId,
                    content: evt.content,
                    content_type: 'text',
                    role: 'bot',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  }
                  addMessage(botMsg)
                } else {
                  // Update existing bot message with new content
                  updateBotMessage(botId, botText)
                }
              }
            } catch (error) {
              console.error('Error processing stream chunk:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error)
        // Add error notification to the UI
        const errorMsg: Message = {
          content: 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.',
          content_type: 'text',
          created_at: new Date().toISOString(),
          id: Date.now() + 2,
          role: 'bot',
          updated_at: new Date().toISOString(),
        }
        addMessage(errorMsg)
      } finally {
        setSending(false)
      }
    },
    [addMessage, conversationId, updateBotMessage]
  )

  return {
    messages: sortedMessages,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    status,
    sending,
    sendMessage,
    followUpOptions,
    isLoading,
    isAuthenticated,
    enableChatbot,
    enableChatbotActions,
  }
}

function extractOptions(text: string) {
  return text
    .split('\n')
    .filter((line) => /<<.+>>/.test(line))
    .map((line) => {
      const regex = /<<(.+?)>>/
      const match = regex.exec(line)
      return match ? match[1] : line
    })
}

'use client'

import type { Message } from '@/models/chatbot'

import { Star, X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchData } from '@/network/helpers/fetch-data'
import { queryKeyConversations } from '@/network/client/chatbot'
import { ChatInput } from './chat-input'
import { ListMessages } from './list-messages'
import { MainButton } from '../buttons/main-button'
import { CourseForm } from './course-form'
import { MealPlanForm } from './meal-plan-form'

const conversationId = '7550511236947361800' // hardcode for demo

export function Chatbot({ open, onClose }: { open: boolean; onClose?: () => void }) {
  const [screen, setScreen] = useState<'chat' | 'course-form' | 'meal-plan-form'>('chat')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const queryClient = useQueryClient()
  const [sending, setSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Helper function to add a message to the chat
  const addMessage = (message: Message) => {
    queryClient.setQueryData([queryKeyConversations, conversationId], (oldData: any) => {
      if (!oldData) {
        return {
          pageParams: [0],
          pages: [
            {
              status: 'success',
              data: [message],
              paging: { page: 0, per_page: 10, total: 1 },
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
  }

  // Helper function to update a bot message
  const updateBotMessage = (botId: number, content: string) => {
    queryClient.setQueryData([queryKeyConversations, conversationId], (old: any) => {
      if (!old) return old
      const pages = [...old.pages]
      const first = { ...pages[0] }
      first.data = first.data.map((m: Message) => (m.id === botId ? { ...m, content } : m))
      pages[0] = first
      return { ...old, pages }
    })
  }

  async function onSubmit(content: string) {
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
      if (!reader) return

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
          } catch {
            /* ignore malformed lines */
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed z-50 inset-0 lg:bottom-4 lg:right-4 lg:w-[400px] lg:h-[80vh] lg:top-auto lg:left-auto bg-primary lg:rounded-2xl lg:shadow-md p-3 flex flex-col">
      <div className="flex items-center justify-between">
        <p className="text-background font-semibold">HLV 24/7 - Đồng hành cùng vóc dáng đẹp</p>
        <Button variant="link" size="icon" onClick={onClose} className="text-background">
          <X />
        </Button>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <div className="bg-background rounded-2xl flex-grow h-64 overflow-hidden" ref={scrollAreaRef}>
          <ScrollArea className="h-full px-3">
            {screen === 'chat' && (
              <ListMessages
                conversationId={conversationId}
                sending={sending}
                scrollToBottom={true}
                onSubmit={onSubmit}
              />
            )}
            {screen === 'course-form' && (
              <CourseForm
                onSubmit={(msg) => {
                  setScreen('chat')
                  onSubmit(msg)
                }}
                onCancel={() => setScreen('chat')}
              />
            )}
            {screen === 'meal-plan-form' && (
              <MealPlanForm
                onSubmit={(msg) => {
                  setScreen('chat')
                  onSubmit(msg)
                }}
                onCancel={() => setScreen('chat')}
              />
            )}
          </ScrollArea>
        </div>
        <ChatInput disabled={sending || screen !== 'chat'} onSubmit={onSubmit} onActionClick={setScreen} />
      </div>
    </div>
  )
}

export function ChatbotTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <MainButton
        className="fixed z-50 bottom-[4.5rem] lg:bottom-4 right-4 rounded-full"
        style={{
          background: 'linear-gradient(45deg,rgba(255, 174, 176, 1) 40%, rgba(19, 216, 167, 1) 90%)',
        }}
        onClick={() => setOpen(true)}
        icon={Star}
        text="HLV 24/7"
      />
      {open && <Chatbot open={open} onClose={() => setOpen(false)} />}
    </>
  )
}

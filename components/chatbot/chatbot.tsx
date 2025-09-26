'use client'

import { Star, X } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatInput } from './chat-input'
import { EmptyState } from './empty-state'
import { useChatbot } from './use-chatbot'
import { CourseForm } from './course-form'
import { ListMessages } from './list-messages'
import { MealPlanForm } from './meal-plan-form'
import { MainButton } from '../buttons/main-button'

export function Chatbot({
  open,
  onClose,
  preview = false,
}: {
  open: boolean
  onClose?: () => void
  preview?: boolean
}) {
  const [screen, setScreen] = useState<'chat' | 'course-form' | 'meal-plan-form'>('chat')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const {
    isLoading,
    isAuthenticated,
    messages,
    status,
    sending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    sendMessage,
    followUpOptions,
    enableChatbot,
    enableChatbotActions,
  } = useChatbot()

  useEffect(() => {
    if (open && !preview) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [open, preview])

  const handleFormSubmit = useCallback(
    (message: string, nextScreen: 'chat' | 'course-form' | 'meal-plan-form' = 'chat') => {
      setScreen(nextScreen)
      sendMessage(message)
    },
    [sendMessage]
  )

  return (
    <div
      className={cn(
        preview
          ? 'h-[600px]'
          : 'fixed z-50 inset-0 lg:bottom-4 lg:right-4 lg:w-[400px] lg:h-[80vh] lg:top-auto lg:left-auto ',
        'bg-primary lg:rounded-2xl lg:shadow-md p-3 flex flex-col'
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-background font-semibold">HLV 24/7 - Đồng hành cùng vóc dáng đẹp</p>
        {!preview && (
          <Button variant="link" size="icon" onClick={onClose} className="text-background">
            <X />
          </Button>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <div className="bg-background rounded-2xl flex-grow h-64 overflow-hidden" ref={scrollAreaRef}>
          {isLoading ? (
            <div className="p-4 flex items-center justify-center h-full">
              <p className="text-center text-foreground">Đang xác nhận quyền truy cập...</p>
            </div>
          ) : !isAuthenticated ? (
            <div className="p-4 flex items-center justify-center h-full">
              <p className="text-center text-foreground">
                Vui lòng{' '}
                <a
                  href={`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                  className="underline underline-offset-2"
                >
                  đăng nhập
                </a>{' '}
                để sử dụng tính năng này
              </p>
            </div>
          ) : !enableChatbot ? (
            <div className="p-4 flex items-center justify-center h-full">
              <p className="text-center text-destructive">
                Bạn không có quyền truy cập vào chatbot. Vui lòng liên hệ quản trị viên
              </p>
            </div>
          ) : screen === 'chat' && messages.length === 0 ? (
            <EmptyState enableActions={enableChatbotActions} onActionClick={setScreen} onSubmit={sendMessage} />
          ) : (
            <ScrollArea className="h-full px-3">
              {screen === 'chat' && messages.length > 0 && (
                <ListMessages
                  messages={messages}
                  status={status}
                  sending={sending}
                  isFetchingNextPage={isFetchingNextPage}
                  hasNextPage={hasNextPage}
                  fetchNextPage={fetchNextPage}
                  scrollToBottom={true}
                  onSubmit={sendMessage}
                />
              )}
              {screen === 'course-form' && (
                <CourseForm onSubmit={(msg) => handleFormSubmit(msg)} onCancel={() => setScreen('chat')} />
              )}
              {screen === 'meal-plan-form' && (
                <MealPlanForm onSubmit={(msg) => handleFormSubmit(msg)} onCancel={() => setScreen('chat')} />
              )}
            </ScrollArea>
          )}
        </div>
        <ChatInput
          disabled={sending || screen !== 'chat' || followUpOptions.length > 0 || !isAuthenticated || !enableChatbot}
          onSubmit={sendMessage}
          onActionClick={setScreen}
          enableActions={enableChatbotActions}
        />
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
        aria-label="Open chat assistant"
      />
      {open && <Chatbot open={open} onClose={() => setOpen(false)} />}
    </>
  )
}

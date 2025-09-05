'use client'

import React, { useEffect, useState, useRef } from 'react'
import { ArrowDown, Star, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { MainButton } from '../buttons/main-button'
import { cn } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
import { useChatbotMessages } from '@/hooks/use-chatbot-messages'
import { useChatbotGreetings } from '@/hooks/use-chatbot-greetings'
import { MessageItem } from './message-item'
import { EmptyState } from './empty-state'
import { TypingIndicator } from './typing-indicator'
import { ChatInput } from './chat-input'
import { getUser } from '@/network/client/users'

import styles from './chatbot.module.css'

const formSchema = z.object({
  message: z.string(),
})

interface ChatBotFormValues {
  message: string
}

interface ChatBotProps {
  isOpen?: boolean
  onClose?: () => void
  isPreview?: boolean
}

export function ChatBot({ isOpen, onClose, isPreview = false }: ChatBotProps) {
  const [isShowingMoveDownButton, setIsShowingMoveDownButton] = useState(false)
  const [isShowingPromptSuggestions, setIsShowingPromptSuggestions] = useState(false)
  const [hasFollowUpOptions, setHasFollowUpOptions] = useState(false)
  const [showEmptyStateForm, setShowEmptyStateForm] = useState<'workout' | 'meal' | null>(null)
  const [userPermissions, setUserPermissions] = useState<{
    enable_chatbot: boolean
    enable_chatbot_actions: boolean
  } | null>(null)
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)

  const { session } = useSession()
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)

  const {
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
    sendMessage: originalSendMessage,
  } = useChatbotMessages(session)

  const { greetings, isFirstFetchGreetingsDone, isLoadingGreetings, isLoadingMore, total, fetchGreetings } =
    useChatbotGreetings(session)

  const form = useForm<ChatBotFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  const sendMessage = async (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => {
    const result = await originalSendMessage(messageValue, isUsingOption, isReSend)

    if (!result?.isUsingOption && !result?.isReSend) {
      form.setValue('message', '')
    }

    setTimeout(() => {
      scrollToBottom()
    }, 0)
  }

  const onSubmit = (formData: ChatBotFormValues) => {
    if (formData.message) {
      sendMessage(formData.message)
    }
  }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  // When is desktop, just getMessages when user open chat box first time. In mobile, get messages.
  useEffect(() => {
    if (session && isOpen) {
      if (!isFirstFetchGreetingsDone) {
        fetchGreetings()
      }
    }
  }, [session, isOpen, isFirstFetchGreetingsDone])

  // Fetch user permissions
  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (session && isOpen) {
        setIsLoadingPermissions(true)
        try {
          const response = await getUser(session.userId)
          console.log('User permissions response:', response)
          if (response.data) {
            setUserPermissions({
              enable_chatbot: response.data.enable_chatbot || false,
              enable_chatbot_actions: response.data.enable_chatbot_actions || false,
            })
          }
        } catch (error) {
          console.error('Failed to fetch user permissions:', error)
          setUserPermissions({
            enable_chatbot: false,
            enable_chatbot_actions: false,
          })
        } finally {
          setIsLoadingPermissions(false)
        }
      }
    }

    fetchUserPermissions()
  }, [session, isOpen])

  useEffect(() => {
    // Listen for scroll events
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      setIsShowingMoveDownButton(container.scrollTop < -container.clientHeight)
    }

    container.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isFetchingNextPage && !isLoadingMessages && !fetchError && hasNextPage) {
          fetchNextPage()
        }
      },
      {
        root: messagesContainerRef.current,
        rootMargin: '20px',
        threshold: 0.1,
      }
    )

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current)
    }

    return () => {
      if (topSentinelRef.current) {
        observer.unobserve(topSentinelRef.current)
      }
    }
  }, [fetchNextPage, isFetchingNextPage, isLoadingMessages, fetchError, hasNextPage])

  return (
    <div
      className={cn(
        isOpen
          ? isPreview
            ? 'h-[620px]'
            : 'fixed z-50 inset-0 lg:top-auto lg:left-auto lg:bottom-16 lg:right-4 lg:w-[400px] lg:h-[80vh]'
          : 'hidden'
      )}
    >
      <div className="w-full h-full max-h-full bg-primary rounded-xl shadow-md flex flex-col p-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-background font-semibold">HLV 24/7 - Đồng hành cùng vóc dáng đẹp</p>
          <Button variant="link" size="icon" onClick={onClose} className="text-background">
            <X className="size-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 flex flex-col bg-background rounded-3xl mb-4 relative overflow-hidden">
          {isLoadingPermissions ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            </div>
          ) : userPermissions && !userPermissions.enable_chatbot ? (
            <div className="flex-1 flex items-center justify-center p-4 text-center">
              <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                <p className="text-red-600 font-medium mb-2">Bạn không có quyền truy cập, liên hệ để được hỗ trợ</p>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`flex-1 overflow-y-auto p-4 flex flex-col-reverse ${styles.messagesContainerScrollbar}`}
                ref={messagesContainerRef}
              >
                <div className="flex flex-col-reverse">
                  {/* The ... component indicates that is waiting for response from AI */}
                  {isLoading && (
                    <div className="flex items-start gap-3 mt-2">
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback className="bg-primary text-background text-xs font-semibold">R</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900 mb-1">Shefit.vn</div>
                        <div className="bg-gray-100 text-gray-800 rounded-lg text-sm inline-block">
                          <TypingIndicator />
                        </div>
                      </div>
                    </div>
                  )}

                  {messages?.map((message, index) => (
                    <MessageItem
                      key={message.id}
                      message={message}
                      index={index}
                      idOfMessageGotError={idOfMessageGotError}
                      sendMessage={sendMessage}
                      onFollowUpOptionsChange={index === 0 ? setHasFollowUpOptions : undefined}
                    />
                  ))}
                </div>

                <EmptyState
                  session={session}
                  isLoadingMessages={isLoadingMessages}
                  fetchError={fetchError}
                  isFirstFetchDone={isFirstFetchDone}
                  messages={messages}
                  onClose={onClose}
                  getMessages={fetchNextPage}
                  sendMessage={sendMessage}
                  showForm={showEmptyStateForm}
                  setShowForm={setShowEmptyStateForm}
                  enableChatbotActions={userPermissions?.enable_chatbot_actions || false}
                />

                <div ref={topSentinelRef} style={{ height: '1px' }} />

                {isShowingMoveDownButton && (
                  <Button
                    className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 text-background rounded-full shadow-lg hover:bg-[#FFAEB0]/80"
                    onClick={scrollToBottom}
                  >
                    <ArrowDown />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Input Area - only show if chatbot is enabled */}
        {userPermissions?.enable_chatbot && !isLoadingPermissions && (
          <ChatInput
            form={form}
            session={session}
            isShowingPromptSuggestions={isShowingPromptSuggestions}
            setIsShowingPromptSuggestions={setIsShowingPromptSuggestions}
            greetings={greetings}
            total={total}
            isLoadingGreetings={isLoadingGreetings}
            isLoadingMore={isLoadingMore}
            onSubmit={onSubmit}
            sendMessage={sendMessage}
            fetchGreetings={fetchGreetings}
            disabled={hasFollowUpOptions || isLoading}
            enableChatbotActions={userPermissions.enable_chatbot_actions}
          />
        )}
      </div>
    </div>
  )
}

export function ChatBotButton() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <MainButton
        // className={`hidden lg:flex lg:fixed lg:z-50 lg:bottom-4 lg:right-4 rounded-full`}
        className={`fixed z-50 bottom-[4.5rem] lg:bottom-4 right-4 rounded-full`}
        style={{
          background: 'linear-gradient(45deg,rgba(255, 174, 176, 1) 40%, rgba(19, 216, 167, 1) 90%)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        icon={Star}
        text="HLV 24/7"
      />
      {isOpen && <ChatBot isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  )
}

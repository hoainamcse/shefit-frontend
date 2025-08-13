'use client'

import React, { useEffect, useState, useRef } from 'react'
import { format } from 'date-fns'
import { ArrowDown, ArrowRight, Loader2, RefreshCcw, Star, X, MenuIcon } from 'lucide-react'
import { toast } from 'sonner'
import { fetchData } from '@/network/helpers/fetch-data'
import { getConversationHistory } from '@/network/client/chatbot'
import { getGreetings } from '@/network/client/chatbot'
import { Message, Greeting } from '@/models/chatbot'

import { Button } from '../ui/button'
import { Input } from '../ui/custom-input-chatbot'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import styles from './chatbot.module.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MainButton } from '../buttons/main-button'
import { cn } from '@/lib/utils'
import BotMessage from './bot-message'
import { useSession } from '@/hooks/use-session'
import PromptSuggestions from './prompt-suggestions'
import Link from 'next/link'

const formSchema = z.object({
  message: z.string(),
})

const LIMIT_MESSAGES_PER_OFFSET = 10
const LIMIT_GREETINGS_PER_OFFSET = 10

interface ChatBotFormValues {
  message: string
}

interface ChatBotProps {
  isOpen?: boolean
  onClose?: () => void
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isFirstFetchDone, setIsFirstFetchDone] = useState(false)
  const [isFirstFetchGreetingsDone, setIsFirstFetchGreetingsDone] = useState(false)
  const [isTypingBot, setIsTypingBot] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { session } = useSession()
  const [idOfMessageGotError, setIdOfMessageGotError] = useState<string>()
  const [flagMessageId, setFlagMessageId] = useState<string>()
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [fetchError, setFetchError] = useState<boolean>(false)
  const [isShowingMoveDownButton, setIsShowingMoveDownButton] = useState(false)
  const [isShowingPromptSuggestions, setIsShowingPromptSuggestions] = useState(false)

  const [greetings, setGreetings] = useState<Greeting[]>([])
  const [isLoadingGreetings, setIsLoadingGreetings] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [greetingPage, setGreetingPage] = useState(0)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const topSentinelRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef<boolean>(false)

  const form = useForm<ChatBotFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  const getParams = () => {
    const params = [`user_id=${session?.userId}`, `limit=${LIMIT_MESSAGES_PER_OFFSET}`, 'order=desc']
    if (flagMessageId) {
      params.push(`after_id=${flagMessageId}`)
    }
    return `?${params.join('&')}`
  }

  const getMessages = async () => {
    if (session && !isFetchingRef.current && !isLoadingMessages && flagMessageId !== 'reached_end') {
      isFetchingRef.current = true
      setIsLoadingMessages(true)
      setFetchError(false)

      try {
        const res = await getConversationHistory(getParams())

        if (res && res.status === 'success' && Array.isArray(res.data)) {
          const messArr = res.data
          const formattedMessages = messArr.map((message) => {
            return {
              ...message,
              created_at: format(new Date(message.created_at), 'dd/MM/yyyy HH:mm'),
              updated_at: format(new Date(message.created_at), 'dd/MM/yyyy HH:mm'),
            }
          })

          setMessages([...messages, ...formattedMessages])
          if (messArr.length > 0) {
            setFlagMessageId(messArr[messArr.length - 1].id) // Use this to set value for param after_id when calling API get more messages.
          } else {
            setFlagMessageId('reached_end')
          }
          setIsFirstFetchDone(true)
        }
      } catch (e) {
        setFetchError(true)
      } finally {
        setIsLoadingMessages(false)
        isFetchingRef.current = false
      }
    }
  }

  const getGreetingParams = (searchQuery: string, isLoadMore?: boolean) => {
    const params = ['active=true', `query=${searchQuery}`, `per_page=${LIMIT_GREETINGS_PER_OFFSET}`]

    if (isLoadMore) {
      params.push(`page=${greetingPage + 1}`)
      setGreetingPage(greetingPage + 1)
    } else {
      params.push(`page=0`) // No load more => is searching or fetching first time => get page 0
      setGreetingPage(0)
    }

    return `?${params.join('&')}`
  }

  const fetchGreetings = async (searchQuery?: string, isLoadMore?: boolean) => {
    if (session && !isLoadingGreetings) {
      if (isLoadMore) {
        setIsLoadingMore(true)
      } else {
        setIsLoadingGreetings(true)
      }

      try {
        const res = await getGreetings(getGreetingParams(searchQuery || '', isLoadMore))

        if (res && res.status === 'success' && Array.isArray(res.data)) {
          if (isLoadMore) {
            setGreetings([...greetings, ...res.data])
          } else {
            setGreetings(res.data)
          }
          setTotal(res.paging?.total || 0)
        }
        setIsFirstFetchGreetingsDone(true)
      } catch (e) {
        toast.error('Có lỗi khi tải danh sách câu hỏi')
      } finally {
        if (isLoadMore) {
          setIsLoadingMore(false)
        } else {
          setIsLoadingGreetings(false)
        }
      }
    }
  }

  const generateRandomString = () => {
    let digits = ''
    digits += Math.floor(Math.random() * 9 + 1)

    for (let i = 1; i < 19; i++) {
      digits += Math.floor(Math.random() * 10)
    }

    return digits
  }

  const sendMessage = async (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => {
    let message = messageValue || ''
    let responseString = ''

    if (isReSend) {
      message = messages[0]?.content // If re-send message, use the newest message to send API
    }

    if (message.trim() && !isTypingBot && session) {
      const currentUserMessageId = generateRandomString()

      // If re-send message, just use the newest message to call API again, don't add new message
      if (!isReSend) {
        const newMessage: Message = {
          id: currentUserMessageId,
          role: 'user',
          content: message,
          content_type: 'text',
          created_at: format(new Date(), 'dd/MM/yyyy HH:mm'),
          updated_at: format(new Date(), 'dd/MM/yyyy HH:mm'),
        }
        setMessages([newMessage, ...messages])
      }

      if (!isUsingOption && !isReSend) form.setValue('message', '') // Just delete input value if send typed message, not default options or re-send

      setIsTypingBot(true) // To prevent user from sending another message while bot is responding
      setIsLoading(true) // To show ... loading animation when bot is "thinking"
      setIdOfMessageGotError(undefined) // Hide error message
      setFetchError(false) // Hide load messages failed error when sending message

      setTimeout(() => {
        scrollToBottom() // Scroll to bottom when new message is sent
      }, 0)

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

        while (true && reader) {
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

        setMessages((prev) => [botResponse, ...prev])
      } catch (err) {
        if (isReSend) {
          setIdOfMessageGotError(messages[0]?.id) // If re-send message failed again, show error message of the newest message
        } else {
          setIdOfMessageGotError(currentUserMessageId)
        }
        toast.error('Xảy ra lỗi khi gửi tin nhắn')
      } finally {
        setIsLoading(false)
        setIsTypingBot(false)
      }
    }
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

      if (!isFirstFetchDone) {
        getMessages()
      }
    }
  }, [session, isOpen, isFirstFetchDone, isFirstFetchGreetingsDone])

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
        if (
          entry.isIntersecting &&
          !isFetchingRef.current &&
          !isLoadingMessages &&
          !fetchError // need fetchError here to prevent spam API when error
        ) {
          getMessages()
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
  }, [getMessages])

  return (
    <div
      className={cn(
        isOpen
          ? 'fixed z-50 inset-0 lg:top-auto lg:left-auto lg:bottom-16 lg:right-4 lg:w-[400px] lg:h-[80vh]'
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
                <div key={index} className="flex items-start gap-3">
                  {message.role === 'user' ? (
                    <div className="w-full flex flex-col">
                      <div className="flex justify-end w-full gap-3 mt-2">
                        <div className="flex flex-col items-end max-w-[90%]">
                          <div className="font-medium text-sm text-gray-900 mb-1">Bạn</div>
                          <div className="flex flex-col bg-blue-100 rounded-lg px-3 py-2 w-full">
                            <div className="text-blue-900 text-sm break-all whitespace-pre-wrap overflow-hidden">
                              {message.content}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">{message.created_at}</p>
                          </div>
                        </div>
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarFallback className="bg-blue-500 text-background text-xs">U</AvatarFallback>
                        </Avatar>
                      </div>

                      {idOfMessageGotError === message.id && (
                        <div className="flex self-end items-center gap-2 mt-2 py-2 px-2 mr-[44px] text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg w-fit">
                          Gửi tin nhắn thất bại
                          <Button
                            variant="secondary"
                            className="bg-red-100 px-2 h-5 text-red-500 text-xs"
                            onClick={() => sendMessage(undefined, false, true)}
                          >
                            <RefreshCcw />
                            Thử lại
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-start w-full gap-3 mt-2">
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback className="bg-primary text-background text-xs font-semibold">S</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 mb-1">Shefit.vn</div>
                        <BotMessage message={message} isNewestMessage={index === 0} sendMessage={sendMessage} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {session ? (
              <div className="flex-1 flex items-center justify-center">
                {isLoadingMessages && <Loader2 className="animate-spin" />}
                {fetchError && (
                  <div className="flex items-center gap-2 mt-2 py-2 px-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg inline-block w-fit">
                    Tải tin nhắn thất bại
                    <Button
                      variant="secondary"
                      className="bg-red-100 px-2 h-5 text-red-500 text-xs"
                      onClick={() => getMessages()}
                    >
                      <RefreshCcw />
                      Thử lại
                    </Button>
                  </div>
                )}
                {messages?.length === 0 && !isLoadingMessages && isFirstFetchDone && !fetchError && (
                  <div className="w-full text-center">
                    <div className="bg-pink-50 p-4 rounded-xl flex flex-col gap-6">
                      <h2 className="text-xl font-bold text-center">Chị muốn được tư vấn gì</h2>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => sendMessage('Tư vấn phom dáng', true)}
                          className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
                        >
                          Tư vấn phom dáng
                        </button>
                        <button
                          onClick={() => sendMessage('Lên Thực Đơn', true)}
                          className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
                        >
                          Lên Thực Đơn
                        </button>
                        <button
                          onClick={() => sendMessage('Lên Khóa Tập', true)}
                          className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
                        >
                          Lên Khóa Tập
                        </button>
                        <button
                          onClick={() => sendMessage('Hỏi Đáp', true)}
                          className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
                        >
                          Hỏi Đáp
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full text-center text-foreground">
                  Bạn phải{' '}
                  <Link href="/auth/login" className="text-primary" onClick={onClose}>
                    đăng nhập
                  </Link>{' '}
                  để sử dụng tính năng này
                </div>
              </div>
            )}

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
        </div>

        {/* Input Area */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2 relative">
                      <Popover open={isShowingPromptSuggestions} onOpenChange={setIsShowingPromptSuggestions}>
                        <PopoverTrigger className="absolute left-[6px] top-1/2 -translate-y-1/2 p-0 bg-primary size-9 rounded-full flex justify-center items-center">
                          <MenuIcon className="text-background" size={20} />
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[320px]">
                          <PromptSuggestions
                            greetings={greetings}
                            handleClose={() => setIsShowingPromptSuggestions(false)}
                            onClickPrompt={sendMessage}
                            fetchGreetings={fetchGreetings}
                            total={total}
                            isSearching={isLoadingGreetings}
                            isLoadingMore={isLoadingMore}
                          />
                        </PopoverContent>
                      </Popover>

                      <Input
                        placeholder="Nhập tin nhắn..."
                        className="bg-white text-foreground rounded-full !min-h-12 px-[52px]"
                        disabled={!session}
                        minRows={1}
                        maxRows={4}
                        autoResize={true}
                        onEnterPress={(e) => {
                          e.preventDefault()
                          form.handleSubmit(onSubmit)()
                        }}
                        {...field}
                      />
                      <Button
                        type="submit"
                        className="absolute right-[6px] top-1/2 -translate-y-1/2 p-0 bg-primary size-9 rounded-full"
                        disabled={!field.value}
                        size="icon"
                      >
                        <ArrowRight />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}

export function ChatBotButton() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <MainButton
        className={`hidden lg:flex lg:fixed lg:z-50 lg:bottom-4 lg:right-4 rounded-full`}
        style={{
          background: 'linear-gradient(45deg,rgba(255, 174, 176, 1) 40%, rgba(19, 216, 167, 1) 90%)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        icon={Star}
        text="HLV 24/7"
      />
      <ChatBot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )
}

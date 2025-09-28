'use client'

import type { Message } from '@/models/chatbot'

import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { useEffect, useRef, memo, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TypingIndicator } from './typing-indicator'

export function ListMessages({
  messages,
  sending = false,
  scrollToBottom = true,
  status,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onSubmit,
}: {
  messages: Message[]
  sending?: boolean
  scrollToBottom?: boolean
  status: 'pending' | 'success' | 'error'
  isFetchingNextPage?: boolean
  hasNextPage?: boolean
  fetchNextPage?: () => void
  onSubmit?: (msg: string) => void
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottomFunction = useCallback(() => {
    if (scrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }, [scrollToBottom])

  // Scroll to bottom when messages change or typing status changes
  useEffect(() => {
    scrollToBottomFunction()
  }, [messages.length, sending, scrollToBottomFunction])

  // Scroll to bottom when data is first loaded
  useEffect(() => {
    if (status === 'success' && messages.length > 0) {
      scrollToBottomFunction()
    }
  }, [status, messages.length, scrollToBottomFunction])

  return (
    <div className="w-full h-full my-3 space-y-2">
      {status === 'pending' && <p className="text-center my-4">Đang tải dữ liệu...</p>}
      {status === 'error' && <p className="text-center my-4 text-red-500">Lỗi khi tải tin nhắn.</p>}

      {hasNextPage && (
        <div className="flex justify-center my-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchNextPage?.()}
            disabled={isFetchingNextPage}
            aria-label="Load older messages"
          >
            {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm'}
          </Button>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          onSubmit={onSubmit}
          isLatestMessage={index === messages.length - 1}
        />
      ))}

      {sending && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  )
}

const MessageItem = memo(
  ({
    message,
    isLatestMessage,
    onSubmit,
  }: {
    message: Message
    isLatestMessage?: boolean
    onSubmit?: (msg: string) => void
  }) => {
    return message.role === 'user' ? (
      <UserMessage message={message} />
    ) : (
      <BotMessage message={message} onSubmit={onSubmit} isLatestMessage={isLatestMessage} />
    )
  }
)
MessageItem.displayName = 'MessageItem'

const UserMessage = memo(({ message }: { message: Message }) => {
  return (
    <div className="flex flex-col justify-end items-end w-fit max-w-[90%] ml-auto">
      <div className="font-medium text-sm text-gray-900 mb-1">Bạn</div>
      <div className="flex flex-col bg-blue-100 rounded-lg px-3 py-2 w-full">
        <div className="text-blue-900 text-sm break-words whitespace-pre-wrap overflow-hidden">{message.content}</div>
        <p className="text-xs text-gray-500 mt-1 text-right">{format(new Date(message.created_at), 'Pp')}</p>
      </div>
    </div>
  )
})
UserMessage.displayName = 'UserMessage'

const removeOptionsFromMessage = (text: string) => {
  const lines = text.split('\n')
  const optionIndex = lines.findIndex((line) => /<<.+>>/.test(line))

  if (optionIndex !== -1) {
    return lines.slice(0, optionIndex).join('\n').trim()
  }

  return text
}

const BotMessage = memo(
  ({
    message,
    isLatestMessage = false,
    onSubmit,
  }: {
    message: Message
    isLatestMessage?: boolean
    onSubmit?: (msg: string) => void
  }) => {
    const messageContent = removeOptionsFromMessage(message.content)

    return (
      <>
        <div className="flex flex-col justify-end items-start w-fit max-w-full mr-auto">
          <div className="font-medium text-sm text-gray-900 mb-1">Shefit.vn</div>
          <div className="flex flex-col bg-gray-100 rounded-lg px-3 py-2 w-full">
            <div className="text-gray-900 text-sm">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-base font-medium mb-1" {...props} />,
                  h4: ({ node, ...props }) => <h4 className="text-sm font-medium mb-1" {...props} />,
                  h5: ({ node, ...props }) => <h5 className="text-xs font-medium mb-1" {...props} />,
                  h6: ({ node, ...props }) => <h6 className="text-xs font-medium mb-1" {...props} />,
                  p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                  em: ({ node, ...props }) => <em className="italic" {...props} />,
                  code: ({ node, ...props }) => (
                    <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto mb-2" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  hr: ({ node, ...props }) => <hr className="border-gray-300 my-3" {...props} />,
                  table: ({ node, ...props }) => (
                    <table className="border-collapse border border-gray-300 mb-2 w-full" {...props} />
                  ),
                  thead: ({ node, ...props }) => <thead className="bg-gray-100" {...props} />,
                  tbody: ({ node, ...props }) => <tbody {...props} />,
                  tr: ({ node, ...props }) => <tr className="border-b border-gray-200" {...props} />,
                  th: ({ node, ...props }) => (
                    <th className="border border-gray-300 px-2 py-1 text-left font-semibold" {...props} />
                  ),
                  td: ({ node, ...props }) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                  del: ({ node, ...props }) => <del className="line-through text-gray-500" {...props} />,
                  mark: ({ node, ...props }) => <mark className="bg-yellow-200 px-1" {...props} />,
                  sub: ({ node, ...props }) => <sub className="text-xs" {...props} />,
                  sup: ({ node, ...props }) => <sup className="text-xs" {...props} />,
                  img: ({ node, ...props }) => (
                    <img className="max-w-full h-auto rounded mb-2" loading="lazy" {...props} />
                  ),
                }}
                remarkPlugins={[remarkGfm]}
              >
                {messageContent}
              </ReactMarkdown>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-left">{format(new Date(message.created_at), 'Pp')}</p>
          </div>
        </div>
        {isLatestMessage && <FollowUpOptions message={message.content} sendMessage={onSubmit} />}
      </>
    )
  }
)
BotMessage.displayName = 'BotMessage'

const FollowUpOptions = memo(({ message, sendMessage }: { message: string; sendMessage?: (msg: string) => void }) => {
  const options = message
    .split('\n')
    .filter((line) => /<<.+>>/.test(line))
    .map((line) => {
      const regex = /<<(.+?)>>/
      const match = regex.exec(line)
      return match ? match[1] : line
    })

  if (options.length === 0) return null

  return (
    <div className="flex flex-col gap-2 mt-3 mb-2">
      <Separator />
      {options.map((option) => (
        <Button
          key={`option-${option}`}
          className="whitespace-normal justify-start h-fit py-1.5 px-3 rounded-lg"
          variant="outline"
          onClick={() => sendMessage?.(`<<${option}>>`)}
        >
          {option}
        </Button>
      ))}
    </div>
  )
})
FollowUpOptions.displayName = 'FollowUpOptions'

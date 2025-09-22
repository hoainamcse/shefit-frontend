'use client'

import type { Message } from '@/models/chatbot'

import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getConversation, queryKeyConversations } from '@/network/client/chatbot'
import { TypingIndicator } from './typing-indicator'

const PER_PAGE = 10

export function ListMessages({
  conversationId,
  sending = false,
  scrollToBottom = true,
  onSubmit,
}: {
  conversationId: string | null
  sending?: boolean
  scrollToBottom?: boolean
  onSubmit?: (msg: string) => void
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: [queryKeyConversations, conversationId],
    queryFn: async ({ pageParam = 0 }) => getConversation(conversationId!, { page: pageParam, per_page: PER_PAGE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if ((lastPage.paging.page + 1) * lastPage.paging.per_page >= lastPage.paging.total) {
        return undefined
      }
      return lastPageParam + 1
    },
    enabled: !!conversationId,
  })

  const messages = data?.pages.flatMap((page) => page.data) || []
  const sortedMessages = messages.reverse() // Sort messages in ascending order by created_at

  const scrollToBottomFunction = () => {
    if (scrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'instant' })
    }
  }

  // Scroll to bottom when messages change or typing status changes
  useEffect(() => {
    scrollToBottomFunction()
  }, [sortedMessages.length, sending])

  // Scroll to bottom when data is first loaded
  useEffect(() => {
    if (status === 'success' && sortedMessages.length > 0) {
      scrollToBottomFunction()
    }
  }, [status])

  return (
    <div className="w-full h-full my-3 space-y-2">
      {status === 'pending' && <p className="text-center my-4">Đang tải tin nhắn...</p>}
      {status === 'error' && <p className="text-center my-4 text-red-500">Lỗi khi tải tin nhắn.</p>}
      {hasNextPage && (
        <div className="flex justify-center my-2">
          <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Đang tải...' : 'Xem thêm'}
          </Button>
        </div>
      )}
      {sortedMessages.map((message, index) =>
        message.role === 'user' ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <BotMessage
            key={message.id}
            message={message}
            onSubmit={onSubmit}
            isLatestMessage={index === sortedMessages.length - 1}
          />
        )
      )}
      {sending && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  )
}

function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col justify-end items-end w-fit max-w-[90%] ml-auto">
      <div className="font-medium text-sm text-gray-900 mb-1">Bạn</div>
      <div className="flex flex-col bg-blue-100 rounded-lg px-3 py-2 w-full">
        <div className="text-blue-900 text-sm break-words whitespace-pre-wrap overflow-hidden">{message.content}</div>
        <p className="text-xs text-gray-500 mt-1 text-right">{format(new Date(message.created_at), 'Pp')}</p>
      </div>
    </div>
  )
}

const removeOptionsFromMessage = (text: string) => {
  // Find lines containing options wrapped in << >>
  const lines = text.split('\n')
  const optionIndex = lines.findIndex((line) => /<<.+>>/.test(line))

  if (optionIndex !== -1) {
    return lines.slice(0, optionIndex).join('\n').trim()
  }

  return text
}

function BotMessage({
  message,
  isLatestMessage = false,
  onSubmit,
}: {
  message: Message
  isLatestMessage?: boolean
  onSubmit?: (msg: string) => void
}) {
  return (
    <>
      <div className="flex flex-col justify-end items-start w-fit max-w-full mr-auto">
        <div className="font-medium text-sm text-gray-900 mb-1">Shefit.vn</div>
        <div className="flex flex-col bg-gray-100 rounded-lg px-3 py-2 w-full">
          {/* <div className="text-gray-900 text-sm break-words whitespace-pre-wrap overflow-hidden">{message.content}</div> */}
          <div className="text-gray-900 text-sm">
            <ReactMarkdown
              components={{
                h1: (props) => <h1 className="text-xl font-bold mb-2" {...props} />,
                h2: (props) => <h2 className="text-lg font-semibold mb-2" {...props} />,
                h3: (props) => <h3 className="text-base font-medium mb-1" {...props} />,
                h4: (props) => <h4 className="text-sm font-medium mb-1" {...props} />,
                h5: (props) => <h5 className="text-xs font-medium mb-1" {...props} />,
                h6: (props) => <h6 className="text-xs font-medium mb-1" {...props} />,
                p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                ul: (props) => <ul className="list-disc pl-5 mb-2" {...props} />,
                ol: (props) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                li: (props) => <li className="mb-1" {...props} />,
                strong: (props) => <strong className="font-semibold" {...props} />,
                em: (props) => <em className="italic" {...props} />,
                code: (props) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                pre: (props) => (
                  <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto mb-2" {...props} />
                ),
                blockquote: (props) => (
                  <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2" {...props} />
                ),
                a: (props) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
                hr: (props) => <hr className="border-gray-300 my-3" {...props} />,
                table: (props) => <table className="border-collapse border border-gray-300 mb-2 w-full" {...props} />,
                thead: (props) => <thead className="bg-gray-100" {...props} />,
                tbody: (props) => <tbody {...props} />,
                tr: (props) => <tr className="border-b border-gray-200" {...props} />,
                th: (props) => <th className="border border-gray-300 px-2 py-1 text-left font-semibold" {...props} />,
                td: (props) => <td className="border border-gray-300 px-2 py-1" {...props} />,
                del: (props) => <del className="line-through text-gray-500" {...props} />,
                mark: (props) => <mark className="bg-yellow-200 px-1" {...props} />,
                sub: (props) => <sub className="text-xs" {...props} />,
                sup: (props) => <sup className="text-xs" {...props} />,
                img: (props) => <img className="max-w-full h-auto rounded mb-2" {...props} />,
              }}
              remarkPlugins={[remarkGfm]}
            >
              {removeOptionsFromMessage(message.content)}
            </ReactMarkdown>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-left">{format(new Date(message.created_at), 'Pp')}</p>
        </div>
      </div>
      {isLatestMessage && <FollowUpOptions message={message.content} sendMessage={onSubmit} />}
    </>
  )
}

const FollowUpOptions = ({ message, sendMessage }: { message: string; sendMessage?: (msg: string) => void }) => {
  const extractOptions = (text: string) => {
    return text
      .split('\n')
      .filter((line) => /<<.+>>/.test(line))
      .map((line) => {
        // Extract content between << and >>
        const regex = /<<(.+?)>>/
        const match = regex.exec(line)
        return match ? match[1] : line
      })
  }

  const options = extractOptions(message)

  if (!options) return null

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
}

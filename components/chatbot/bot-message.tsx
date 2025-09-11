'use client'

import { useEffect, useState } from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { Message } from '@/models/chatbot'

import { Separator } from '../ui/separator'
import { Button } from '../ui/button'

interface BotMessageProps {
  message: Message
  isNewestMessage: boolean
  sendMessage: (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => void
  onFollowUpOptionsChange?: (hasOptions: boolean) => void
}

export default function BotMessage({
  message,
  isNewestMessage,
  sendMessage,
  onFollowUpOptionsChange,
}: BotMessageProps) {
  const [currentMessage, setCurrentMessage] = useState<Message>(message)

  const removeOptionsFromMessage = (text: string) => {
    // Find lines containing options wrapped in << >>
    const lines = text.split('\n')
    const optionIndex = lines.findIndex((line) => /<<.+>>/.test(line))

    if (optionIndex !== -1) {
      return lines.slice(0, optionIndex).join('\n').trim()
    }

    return text
  }

  const typeMessage = (mess: string, messageId: string) => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= mess.length) {
        setCurrentMessage((prev) =>
          prev.id === messageId
            ? {
                ...prev,
                content: mess.slice(0, currentIndex),
                status: currentIndex < mess.length ? 'is_typing' : message.status,
              }
            : prev
        )
        currentIndex += 5
      } else {
        clearInterval(typingInterval)
      }
    }, 10)
  }

  useEffect(() => {
    if (currentMessage.status === 'is_new' && isNewestMessage) {
      typeMessage(currentMessage.content, currentMessage.id)
    }
  }, [])

  useEffect(() => {
    if (isNewestMessage && onFollowUpOptionsChange) {
      // Check if there are any lines containing << >> (potential options)
      const options = message.content.split('\n').filter((line) => /<<.+>>/.test(line))
      onFollowUpOptionsChange(options.length > 0)
    }
  }, [isNewestMessage, message.content, onFollowUpOptionsChange])

  return (
    <>
      <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm w-fit max-w-[90%]">
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
            blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2" {...props} />,
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
          {removeOptionsFromMessage(currentMessage.content)}
        </ReactMarkdown>
        <p className="text-xs mt-1 text-gray-500">{currentMessage.created_at}</p>
      </div>

      {isNewestMessage && currentMessage.status !== 'is_typing' && (
        <FollowUpOptions message={message.content} sendMessage={sendMessage} />
      )}
    </>
  )
}

const FollowUpOptions = ({
  message,
  sendMessage,
}: {
  message: string
  sendMessage: (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => void
}) => {
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

  return options.length > 0 ? (
    <div className="flex flex-col gap-2 mt-3 mb-2">
      <Separator />

      {options.map((option) => (
        <Button
          key={`option-${option}`}
          className="whitespace-normal justify-start h-fit py-1.5 px-3 rounded-lg"
          variant="outline"
          onClick={() => sendMessage(`<<${option}>>`, true, false)}
        >
          {option}
        </Button>
      ))}
    </div>
  ) : (
    <></>
  )
}

'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Message } from '@/models/chatbot'

import { Separator } from '../ui/separator'
import { Button } from '../ui/button'

const FOLLOW_UP_MESSAGES = [
  'Chị muốn chọn giữa các thực đơn có sẵn của Shefit hay chị muốn em lên thực đơn mới? \n- Chọn thực đơn có sẵn\n- Tạo thực đơn theo ý chị\n',
  'Chị muốn chọn khóa tập có sẵn hay tạo khóa tập mới?\n- Chọn khóa tập có sẵn\n- Tạo khóa tập mới\n',
  'Em xin recommend khóa tập và thực đơn mới phù hợp hơn với thay đổi của chị nha\n- Khóa tập\n- Thực đơn\n',
]

interface BotMessageProps {
  message: Message
  isNewestMessage: boolean
  sendMessage: (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => void
}

export default function BotMessage({ message, isNewestMessage, sendMessage }: BotMessageProps) {
  const [currentMessage, setCurrentMessage] = useState<Message>(message)

  const removeOptionsMessage = (text: string) => {
    for (const msg of FOLLOW_UP_MESSAGES) {
      if (text.includes(msg)) {
        const trimmed = msg.split('\n')[0] // Lấy phần trước \n
        return text.replace(msg, trimmed) // Thay toàn bộ msg bằng phần đã rút gọn
      }
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

  return (
    <>
      <div className='bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm w-fit max-w-[90%]'>
        <ReactMarkdown
          components={{
            ul: (props) => <ul className='list-disc pl-5' {...props} />,
            ol: (props) => <ol className='list-decimal pl-5' {...props} />,
          }}
        >
          {removeOptionsMessage(currentMessage.content)}
        </ReactMarkdown>
        <p className='text-xs mt-1 text-gray-500'>{currentMessage.created_at}</p>
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
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).trim())
  }

  const followUpMessage = FOLLOW_UP_MESSAGES.find((item) => message.includes(item))

  const options = followUpMessage ? extractOptions(followUpMessage) : []

  return options.length > 0 ? (
    <div className='flex flex-col gap-2 mt-3 mb-2'>
      <Separator />

      {options.map((option, index) => (
        <Button
          key={`option-${index}`}
          className='whitespace-normal justify-start h-fit py-1.5 px-3 rounded-lg'
          variant='outline'
          onClick={() => sendMessage(option, true, false)}
        >
          {option}
        </Button>
      ))}
    </div>
  ) : (
    <></>
  )
}

import React from 'react'
import { RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import BotMessage from './bot-message'
import { Message } from '@/models/chatbot'

interface MessageItemProps {
  message: Message
  index: number
  idOfMessageGotError?: string
  sendMessage: (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => Promise<any>
  onFollowUpOptionsChange?: (hasOptions: boolean) => void
}

export function MessageItem({
  message,
  index,
  idOfMessageGotError,
  sendMessage,
  onFollowUpOptionsChange,
}: MessageItemProps) {
  if (message.role === 'user') {
    return (
      <div className="w-full flex flex-col">
        <div className="flex justify-end w-full gap-3 mt-2">
          <div className="flex flex-col items-end max-w-[90%]">
            <div className="font-medium text-sm text-gray-900 mb-1">Bạn</div>
            <div className="flex flex-col bg-blue-100 rounded-lg px-3 py-2 w-full">
              <div className="text-blue-900 text-sm break-words whitespace-pre-wrap overflow-hidden">
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
    )
  }

  return (
    <div className="flex justify-start w-full gap-3 mt-2">
      <Avatar className="w-8 h-8 mt-1">
        <AvatarFallback className="bg-primary text-background text-xs font-semibold">S</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 mb-1">Shefit.vn</div>
        <BotMessage
          message={message}
          isNewestMessage={index === 0}
          sendMessage={sendMessage}
          onFollowUpOptionsChange={onFollowUpOptionsChange}
        />
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { ArrowRight, Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from './custom-input-chatbot'
import { CommonMessages } from './common-messages'
import { ChatActions } from './chat-actions'

export function ChatInput({
  disabled = false,
  onSubmit,
  onActionClick: _onActionClick,
}: {
  disabled?: boolean
  onSubmit?: (message: string) => void
  onActionClick?: (id: 'course-form' | 'meal-plan-form') => void
}) {
  const [value, setValue] = useState('')
  const [openPopover, setOpenPopover] = useState(false)

  const isDisabled = value.trim().length === 0 || disabled

  function onClick() {
    if (!isDisabled) {
      setValue('')
      onSubmit?.(value.trim())
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onClick()
    }
  }

  function onMessageClick(m: string) {
    onSubmit?.(m)
    setOpenPopover(false)
  }

  function onActionClick(id: 'course-form' | 'meal-plan-form') {
    _onActionClick?.(id)
    setOpenPopover(false)
  }

  return (
    <div className="relative">
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger
          className="absolute left-[6px] top-1/2 -translate-y-1/2 p-0 bg-primary size-9 rounded-full flex justify-center items-center"
          disabled={disabled}
        >
          <Menu className="text-background" size={20} />
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[320px] rounded-lg">
          <ScrollArea className="h-[400px]">
            <div className="p-3 space-y-4">
              <ChatActions onMessageClick={onMessageClick} onClick={onActionClick} />
              <Separator />
              <CommonMessages enable={openPopover} onClick={onMessageClick} />
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
      <Input
        placeholder="Nhập tin nhắn..."
        className="bg-white text-foreground rounded-full !min-h-12 px-[52px]"
        disabled={disabled}
        minRows={1}
        maxRows={4}
        autoResize={true}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button
        className="absolute right-[6px] top-1/2 -translate-y-1/2 p-0 bg-primary size-9 rounded-full"
        disabled={isDisabled}
        size="icon"
        onClick={onClick}
      >
        <ArrowRight />
      </Button>
    </div>
  )
}

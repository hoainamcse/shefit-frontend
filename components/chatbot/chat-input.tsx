'use client'

import { useState, useCallback, memo } from 'react'
import { ArrowRight, Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from './custom-input-chatbot'
import { CommonMessages } from './common-messages'
import { ChatActions } from './chat-actions'

export const ChatInput = memo(
  ({
    disabled = false,
    enableActions = false,
    onSubmit,
    onActionClick,
  }: {
    disabled?: boolean
    enableActions?: boolean
    onSubmit?: (message: string) => void
    onActionClick?: (id: 'course-form' | 'meal-plan-form') => void
  }) => {
    const [value, setValue] = useState('')
    const [openPopover, setOpenPopover] = useState(false)

    const isDisabled = value.trim().length === 0 || disabled

    const handleSubmit = useCallback(
      (e?: React.FormEvent) => {
        e?.preventDefault()

        if (!isDisabled && value.trim()) {
          onSubmit?.(value.trim())
          setValue('')
        }
      },
      [isDisabled, onSubmit, value]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleSubmit()
        }
      },
      [handleSubmit]
    )

    const handleMessageClick = useCallback(
      (message: string) => {
        onSubmit?.(message)
        setOpenPopover(false)
      },
      [onSubmit]
    )

    const handleActionClick = useCallback(
      (id: 'course-form' | 'meal-plan-form') => {
        onActionClick?.(id)
        setOpenPopover(false)
      },
      [onActionClick]
    )

    return (
      <form onSubmit={handleSubmit} className="relative">
        <Popover open={openPopover} onOpenChange={setOpenPopover}>
          <PopoverTrigger
            className="absolute left-[6px] top-1/2 -translate-y-1/2 p-0 bg-primary size-9 rounded-full flex justify-center items-center"
            disabled={disabled}
            type="button"
            aria-label="Show message options"
          >
            <Menu className="text-background" size={20} />
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[320px] rounded-lg">
            <ScrollArea className="h-[400px]">
              <div className="p-3 space-y-4">
                {enableActions && (
                  <>
                    <ChatActions onMessageClick={handleMessageClick} onClick={handleActionClick} />
                    <Separator />
                  </>
                )}
                <CommonMessages enable={openPopover} onClick={handleMessageClick} />
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
          onKeyDown={handleKeyDown}
          aria-label="Chat message input"
        />
        <Button
          className="absolute right-[6px] top-1/2 -translate-y-1/2 p-0 bg-primary size-9 rounded-full"
          disabled={isDisabled}
          size="icon"
          type="submit"
          aria-label="Send message"
        >
          <ArrowRight />
        </Button>
      </form>
    )
  }
)

ChatInput.displayName = 'ChatInput'

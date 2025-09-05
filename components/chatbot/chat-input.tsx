import React from 'react'
import { ArrowRight, MenuIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from './custom-input-chatbot'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import PromptSuggestions from './prompt-suggestions'
import { UseFormReturn } from 'react-hook-form'
import { Greeting } from '@/models/chatbot'

interface ChatInputProps {
  form: UseFormReturn<{ message: string }>
  session: any
  isShowingPromptSuggestions: boolean
  setIsShowingPromptSuggestions: (value: boolean) => void
  greetings: Greeting[]
  total: number
  isLoadingGreetings: boolean
  isLoadingMore: boolean
  onSubmit: (data: { message: string }) => void
  sendMessage: (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => Promise<any>
  fetchGreetings: (searchQuery?: string, isLoadMore?: boolean) => Promise<void>
  disabled?: boolean
  enableChatbotActions?: boolean
}

export function ChatInput({
  form,
  session,
  isShowingPromptSuggestions,
  setIsShowingPromptSuggestions,
  greetings,
  total,
  isLoadingGreetings,
  isLoadingMore,
  onSubmit,
  sendMessage,
  fetchGreetings,
  disabled = false,
  enableChatbotActions = false,
}: ChatInputProps) {
  return (
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
                        enableChatbotActions={enableChatbotActions}
                      />
                    </PopoverContent>
                  </Popover>

                  <Input
                    placeholder="Nhập tin nhắn..."
                    className="bg-white text-foreground rounded-full !min-h-12 px-[52px]"
                    disabled={!session || disabled}
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
                    disabled={!field.value || disabled}
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
  )
}

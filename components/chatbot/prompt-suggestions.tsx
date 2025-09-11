'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChevronUp, Settings, Dumbbell, Utensils, LineChart, MessageCircleQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import styles from './chatbot.module.css'
import { Greeting } from '@/models/chatbot'
import { useDebounce } from '@/hooks/use-debounce'
import { WorkoutForm } from './workout-form'
import { MealForm } from './meal-form'

interface PromptSuggestionsProps {
  greetings: Greeting[]
  total: number
  isSearching: boolean
  isLoadingMore: boolean
  handleClose: () => void
  onClickPrompt: (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => void
  fetchGreetings: (searchQuery: string, isLoadMore?: boolean) => Promise<void>
  enableChatbotActions?: boolean
}

interface ActionItem {
  id: string
  label: string
  icon: React.ReactNode
  message: string
}

type FormType = 'workout' | 'meal' | null

const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'workout',
    label: 'Lên Khoá Tập',
    icon: <Dumbbell className="h-5 w-5" />,
    message: 'Lên Khoá Tập',
  },
  {
    id: 'meal',
    label: 'Lên Thực Đơn',
    icon: <Utensils className="h-5 w-5" />,
    message: 'Lên Thực Đơn',
  },
  {
    id: 'progress',
    label: 'Theo dõi tiến độ',
    icon: <LineChart className="h-5 w-5" />,
    message: 'Theo dõi tiến độ',
  },
]

export default function PromptSuggestions({
  greetings,
  total,
  isSearching,
  isLoadingMore,
  handleClose,
  onClickPrompt,
  fetchGreetings,
  enableChatbotActions = false,
}: PromptSuggestionsProps) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const debouncedQuery = useDebounce(searchQuery, 800)
  const [showForm, setShowForm] = useState<FormType>(null)

  useEffect(() => {
    if (debouncedQuery !== undefined) {
      fetchGreetings(debouncedQuery, false)
    }
  }, [debouncedQuery, fetchGreetings])

  const handleLoadMore = async () => {
    await fetchGreetings(debouncedQuery || '', true)
  }

  const handleActionClick = (actionId: string, message: string) => {
    if (actionId === 'workout' || actionId === 'meal') {
      setShowForm(actionId as FormType)
    } else {
      onClickPrompt(message, true, false)
      handleClose()
    }
  }

  const createFormMessage = (type: 'workout' | 'meal', data: any) => {
    if (type === 'workout') {
      return `Lên khoá tập
---------------
Tuổi: ${data.age}
Chiều cao: ${data.height}cm
Cân nặng: ${data.weight}kg
Số đo 3 vòng: ${data.measurements}cm
Số đo bụng dưới: ${data.bellyMeasurement}cm
Kinh nghiệm tập luyện: ${data.isExperienced ? 'Đã biết tập' : 'Người mới'}
Tình trạng sức khỏe: ${data.injuries || 'Không có vấn đề gì'}
Số ngày tập trong tuần: ${data.weeklyDays} ngày`
    }

    return `Lên thực đơn
---------------
Tuổi: ${data.age}
Chiều cao: ${data.height}cm
Cân nặng: ${data.weight}kg
Mục tiêu: ${data.goal}
Sở thích ăn uống: ${data.foodPreferences}`
  }

  const handleFormSubmit = (type: 'workout' | 'meal') => (data: any) => {
    const message = createFormMessage(type, data)
    onClickPrompt(message, true, false)
    handleClose()
  }

  const handleFormCancel = () => {
    setShowForm(null)
  }

  const handleGreetingClick = (message: string) => {
    onClickPrompt(message, true, false)
    handleClose()
  }

  const CloseButton = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClose}
      className="absolute right-2 top-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-pink-200 hover:border-[2px]"
    >
      <X className="w-5 h-5 text-gray-600" />
    </Button>
  )

  const ActionSection = () => {
    if (!enableChatbotActions) return null

    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="text-primary w-5 h-5" />
          <h3 className="font-semibold text-lg">Thao Tác</h3>
        </div>
        <div className="flex flex-col gap-3 mb-4 p-1">
          {ACTION_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              onClick={() => handleActionClick(item.id, item.message)}
              className="w-full px-4 py-6 rounded-xl bg-primary hover:bg-primary/85 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-3 justify-start"
            >
              <div className="bg-background p-2 rounded-full">{item.icon}</div>
              <p className="text-gray-800 font-medium text-base">{item.label}</p>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const SearchSection = () => (
    <div className="relative mb-4 p-1">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
        <Search className="text-primary w-5 h-5" strokeWidth={3} />
      </div>
      <Input
        type="text"
        placeholder="Tìm câu hỏi..."
        value={searchQuery || ''}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-4 py-3 pl-10 rounded-full border-2 border-primary bg-white/80 backdrop-blur-sm focus:border-primary"
      />
    </div>
  )

  const SearchResultsInfo = () => {
    if (!debouncedQuery) return null

    return (
      <div className="text-sm text-gray-600 px-2 mb-2">
        {isSearching ? 'Đang tìm kiếm...' : `Tìm thấy ${total} kết quả cho "${debouncedQuery}"`}
      </div>
    )
  }

  const GreetingButtons = () => {
    if (isSearching) return null

    return (
      <div className="flex flex-col gap-2 w-[calc(100%-4px)]">
        {greetings.map((item) => (
          <Button
            key={item.id}
            title={item.message}
            variant="outline"
            onClick={() => handleGreetingClick(item.message)}
            className="w-full px-4 py-2 rounded-2xl bg-gray-50 hover:bg-gray-100 border-gray-200 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <p className="text-gray-800 font-medium text-base w-full whitespace-nowrap overflow-x-auto md:overflow-hidden md:text-ellipsis [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {item.message}
            </p>
          </Button>
        ))}
      </div>
    )
  }

  const LoadMoreButton = () => {
    if (greetings.length >= total || isLoadingMore || isSearching || greetings.length === 0) {
      return null
    }

    return (
      <div className="flex justify-center">
        <Button onClick={handleLoadMore} variant="ghost" className="text-gray-600">
          Xem thêm
        </Button>
      </div>
    )
  }

  const LoadingIndicator = () => {
    if (!isSearching && !isLoadingMore) return null

    return (
      <div className="flex justify-center">
        <div className="animate-spin mt-2 rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const AllResultsIndicator = () => {
    if (greetings.length !== total || greetings.length === 0 || isSearching) {
      return null
    }

    return (
      <div className="flex justify-center mt-2">
        <div className="text-sm text-gray-500 flex items-center">
          <ChevronUp className="w-4 h-4 mr-1" />
          Đã hiển thị tất cả kết quả
        </div>
      </div>
    )
  }

  const NoResultsMessage = () => {
    if (showForm || greetings.length > 0 || isSearching || !debouncedQuery) {
      return null
    }

    return (
      <div className="text-center py-8 text-gray-500">
        <p>Không tìm thấy kết quả nào cho "{debouncedQuery}"</p>
        <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
      </div>
    )
  }

  const FAQSection = () => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircleQuestion className="text-primary w-5 h-5" />
        <h3 className="font-semibold text-lg">Các Câu Hỏi Thường Gặp</h3>
      </div>

      <SearchSection />
      <SearchResultsInfo />
      <GreetingButtons />
      <LoadMoreButton />
      <LoadingIndicator />
      <AllResultsIndicator />
      <NoResultsMessage />
    </div>
  )

  const FormContent = () => {
    if (showForm === 'workout') {
      return <WorkoutForm onSubmit={handleFormSubmit('workout')} onCancel={handleFormCancel} />
    }
    if (showForm === 'meal') {
      return <MealForm onSubmit={handleFormSubmit('meal')} onCancel={handleFormCancel} />
    }
    return null
  }

  const MainContent = () => {
    if (showForm) return <FormContent />

    return (
      <>
        <ActionSection />
        {enableChatbotActions && <Separator className="my-4" />}
        <FAQSection />
      </>
    )
  }

  return (
    <Card className="w-full max-w-md rounded-lg mx-auto border-0 bg-background">
      <CardContent className="p-3 space-y-3 relative">
        <CloseButton />

        <div className={`h-[350px] overflow-auto ${styles.promptsContainerScrollbar}`}>
          <MainContent />
        </div>
      </CardContent>
    </Card>
  )
}

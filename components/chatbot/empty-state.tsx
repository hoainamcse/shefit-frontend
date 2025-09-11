'use client'

import React from 'react'
import { Loader2, RefreshCcw } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { WorkoutForm } from './workout-form'
import { MealForm } from './meal-form'
import { usePathname } from 'next/navigation'

interface EmptyStateProps {
  session: any
  isLoadingMessages: boolean
  fetchError: boolean
  isFirstFetchDone: boolean
  messages: any[]
  onClose?: () => void
  getMessages: () => void
  sendMessage: (messageValue?: string, isUsingOption?: boolean, isReSend?: boolean) => Promise<any>
  showForm: 'workout' | 'meal' | null
  setShowForm: (form: 'workout' | 'meal' | null) => void
  enableChatbotActions: boolean
}

export function EmptyState({
  session,
  isLoadingMessages,
  fetchError,
  isFirstFetchDone,
  messages,
  onClose,
  getMessages,
  sendMessage,
  showForm,
  setShowForm,
  enableChatbotActions,
}: EmptyStateProps) {
  const pathname = usePathname()

  const handleActionClick = (actionType: string) => {
    if (actionType === 'workout' || actionType === 'meal') {
      setShowForm(actionType)
    } else {
      sendMessage(actionType, true)
    }
  }

  const handleWorkoutFormSubmit = (data: any) => {
    const message = `Lên khoá tập
---------------
Tuổi: ${data.age}
Chiều cao: ${data.height}cm
Cân nặng: ${data.weight}kg
Số đo 3 vòng: ${data.measurements}cm
Số đo bụng dưới: ${data.bellyMeasurement}cm
Kinh nghiệm tập luyện: ${data.isExperienced ? 'Đã biết tập' : 'Người mới'}
Tình trạng sức khỏe: ${data.injuries || 'Không có vấn đề gì'}
Số ngày tập trong tuần: ${data.weeklyDays} ngày`

    sendMessage(message, true, false)
    setShowForm(null)
  }

  const handleMealFormSubmit = (data: any) => {
    const message = `Lên thực đơn
---------------
Tuổi: ${data.age}
Chiều cao: ${data.height}cm
Cân nặng: ${data.weight}kg
Mục tiêu: ${data.goal}
Sở thích ăn uống: ${data.foodPreferences}`

    sendMessage(message, true, false)
    setShowForm(null)
  }

  const handleFormCancel = () => {
    setShowForm(null)
  }
  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full text-center text-foreground">
          Bạn phải{' '}
          <Link
            href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
            className="text-primary"
            onClick={onClose}
          >
            đăng nhập
          </Link>{' '}
          để sử dụng tính năng này
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      {isLoadingMessages && <Loader2 className="animate-spin" />}
      {fetchError && (
        <div className="flex items-center gap-2 mt-2 py-2 px-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg w-fit">
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
          {/* Show forms when selected */}
          {showForm === 'workout' && (
            <div className="bg-pink-50 p-4 rounded-xl">
              <WorkoutForm onSubmit={handleWorkoutFormSubmit} onCancel={handleFormCancel} />
            </div>
          )}

          {showForm === 'meal' && (
            <div className="bg-pink-50 p-4 rounded-xl">
              <MealForm onSubmit={handleMealFormSubmit} onCancel={handleFormCancel} />
            </div>
          )}

          {/* Show default buttons when no form is active */}
          {!showForm && (
            <div className="bg-pink-50 p-4 rounded-xl flex flex-col gap-6">
              <h2 className="text-xl font-bold text-center">Chị muốn được tư vấn gì</h2>
              <div className={`grid ${enableChatbotActions ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                <button
                  onClick={() => sendMessage('Tư vấn phom dáng', true)}
                  className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
                >
                  Tư vấn phom dáng
                </button>
                {enableChatbotActions && (
                  <button
                    onClick={() => handleActionClick('meal')}
                    className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
                  >
                    Lên Thực Đơn
                  </button>
                )}
                {enableChatbotActions && (
                  <button
                    onClick={() => handleActionClick('workout')}
                    className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
                  >
                    Lên Khóa Tập
                  </button>
                )}
                <button
                  onClick={() => sendMessage('Hỏi Đáp', true)}
                  className="bg-pink-100 hover:bg-pink-200 transition-colors text-pink-900 rounded-xl p-3 text-sm font-medium"
                >
                  Hỏi Đáp
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

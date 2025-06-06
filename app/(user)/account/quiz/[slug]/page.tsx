'use client'

import React, { useEffect, useState, use } from 'react'
import { getUserBodyQuizzById } from '@/network/server/user-body-quizz'
import { useAuth } from '@/components/providers/auth-context'
import { UserBodyQuizz } from '@/models/user-body-quizz'
import { ApiResponse } from '@/models/response'
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}
export default function QuizDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { userId } = useAuth()
  const [quizData, setQuizData] = useState<UserBodyQuizz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuizData() {
      try {
        const response = await getUserBodyQuizzById(slug)
        if (response.status === 'success' && response.data) {
          setQuizData(response.data)
        } else {
          setError('Không tìm thấy kết quả')
        }
      } catch (err) {
        console.error('Error fetching quiz data:', err)
        setError('Có lỗi xảy ra khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchQuizData()
    }
  }, [slug])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>
  }

  if (error || !quizData) {
    return <div className="flex justify-center items-center min-h-[400px]">{error || 'Không tìm thấy kết quả'}</div>
  }

  return (
    <div className="flex flex-col gap-10 mt-10 p-10">
      <img src="/body-quiz-image.jpg" alt="body-quiz-image" className="h-[680px]" />
      <div className="xl:text-3xl max-lg:text-xl flex flex-col gap-5">
        <p>Kết quả ngày {formatDate(quizData.quiz_date)}</p>
        <p className="text-gray-500">
          Chỉ số <span className="text-ring underline">HLV Đánh Giá Phom Dáng</span>
        </p>
        <div className="text-gray-500 xl:text-xl max-lg:base">
          {quizData.responses && quizData.responses.map((response: string) => <p key={response}>{response}</p>)}
        </div>
      </div>
    </div>
  )
}

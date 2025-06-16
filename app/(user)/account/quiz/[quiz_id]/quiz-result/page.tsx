'use client'

import React, { useEffect, useState } from 'react'
import { getBodyQuizResultByUser } from '@/network/server/body-quizzes'
import { UserBodyQuiz } from '@/models/body-quiz'
import { useParams } from 'next/navigation'

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export default function QuizResultPage() {
  const params = useParams<{ quiz_id: string }>()
  const quiz_id = Number(params?.quiz_id)
  const [quizData, setQuizData] = useState<UserBodyQuiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuizData() {
      try {
        setLoading(true)
        const response = await getBodyQuizResultByUser(quiz_id)

        if (response?.status === 'success' && response.data) {
          setQuizData(response.data)
        } else {
          setError('Không tìm thấy kết quả đánh giá')
        }
      } catch (err) {
        console.error('Error fetching quiz data:', err)
        setError('Có lỗi xảy ra khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    if (quiz_id) {
      fetchQuizData()
    }
  }, [quiz_id])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>
  }

  if (error || !quizData) {
    return <div className="p-4 text-red-500">{error || 'Không tìm thấy dữ liệu đánh giá'}</div>
  }

  return (
    <div className="flex flex-col gap-10 mt-10 p-10">
      <img src="/body-quiz-image.jpg" alt="body-quiz-image" className="h-[680px]" />
      <div className="xl:text-3xl max-lg:text-xl flex flex-col gap-5">
        <p>
          Kết quả ngày {formatDate(quizData.quiz_date)} - {quizData.body_quiz?.title || 'Đánh giá cơ thể'}
        </p>
        <p className="text-gray-500">
          <span className="text-ring underline">HLV Đánh Giá</span>
        </p>
        <div className="text-gray-500 xl:text-xl max-lg:base">{quizData.comment || 'Chưa có kết quả đánh giá'}</div>
      </div>
    </div>
  )
}

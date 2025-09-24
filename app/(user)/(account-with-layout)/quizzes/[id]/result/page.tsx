'use client'

import React from 'react'
import { getBodyQuizHistory, getBodyQuiz, queryKeyBodyQuizzes } from '@/network/client/body-quizzes'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { HTMLRenderer } from '@/components/html-renderer'

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export default function QuizResultPage() {
  const params = useParams<{ id: string }>()
  const attemptId = Number(params?.id)

  // Use React Query to fetch the quiz attempt history
  const {
    data: attemptResponse,
    isLoading: isLoadingAttempt,
    error: attemptError,
  } = useQuery({
    queryKey: [queryKeyBodyQuizzes, 'attempts', attemptId],
    queryFn: () => getBodyQuizHistory(attemptId),
    enabled: !!attemptId && !isNaN(attemptId),
  })

  const attemptData = attemptResponse?.data || null
  const quizId = attemptData?.body_quiz?.id

  // Use React Query to fetch the complete quiz data with questions
  const {
    data: quizResponse,
    isLoading: isLoadingQuiz,
    error: quizError,
  } = useQuery({
    queryKey: [queryKeyBodyQuizzes, quizId],
    queryFn: () => getBodyQuiz(quizId!),
    enabled: !!quizId,
  })

  const isLoading = isLoadingAttempt || isLoadingQuiz
  const error = attemptError || quizError

  // Combine the data
  const quizData = attemptData
    ? {
        ...attemptData,
        body_quiz: {
          ...attemptData.body_quiz,
          questions: quizResponse?.data?.questions || [],
        },
      }
    : null

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !quizData) {
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error ? error.message : 'Không tìm thấy dữ liệu đánh giá'}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10 md:mt-10 mt-0 p-4 md:p-10 relative">
      <Link
        href="/account/quizzes"
        className="inline-flex items-center gap-2 text-lg font-semibold transition-colors mb-4 absolute top-5 left-13"
      >
        <BackIconBlack className="w-5 h-5" />
        <span>Quay về</span>
      </Link>
      <img
        src="/body-quiz-image.jpg"
        alt="body-quiz-image"
        className="md:aspect-[1800/681] aspect-[440/281] object-cover"
      />
      <div className="xl:text-2xl max-lg:text-lg flex flex-col gap-5">
        <p>
          Kết quả ngày {formatDate(quizData.quiz_date)} - {quizData.body_quiz?.title || 'Đánh giá cơ thể'}
        </p>
        <div className="md:space-y-6 space-y-2 text-lg text-gray-600">
          {quizData.body_quiz.questions &&
            quizData.body_quiz.questions.map((question, index) => (
              <div key={question.id} className="pb-4">
                <h3 className="font-medium text-gray-800 mb-1">
                  Câu hỏi {index + 1}: {question.title}
                </h3>
                <p className="text-gray-600">{quizData.responses[index] || 'Chưa có câu trả lời'}</p>
              </div>
            ))}
        </div>
        <p className="text-gray-500">
          <span className="text-ring underline text-xl">HLV Đánh Giá</span>
        </p>
        <HTMLRenderer
          content={quizData.comment || 'Chưa có kết quả đánh giá'}
          className="text-gray-500 xl:text-lg max-lg:sm"
        />
      </div>
    </div>
  )
}

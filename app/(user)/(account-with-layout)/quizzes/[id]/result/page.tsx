'use client'

import React from 'react'
import { format } from 'date-fns'
import { getBodyQuizHistory, getBodyQuiz, queryKeyBodyQuizzes } from '@/network/client/body-quizzes'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { sortByKey } from '@/utils/helpers'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { HTMLRenderer } from '@/components/html-renderer'

// Helper function to check if a string is a valid image URL
const isValidImageUrl = (url: string): boolean => {
  try {
    new URL(url)
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
  } catch {
    return false
  }
}

// Component to render question responses
const QuestionResponse = ({ question, response, index }: { question: any; response: string; index: number }) => {
  // Handle IMAGE_UPLOAD responses - they are semicolon-separated URLs
  if (question.question_type === 'IMAGE_UPLOAD' && response) {
    const imageUrls = response
      .split(';')
      .map((url) => url.trim())
      .filter((url) => isValidImageUrl(url))

    if (imageUrls.length > 0) {
      return (
        <div className="space-y-2">
          <p className="text-gray-600 text-sm">Hình ảnh đã tải lên:</p>
          <div className="flex flex-wrap items-center gap-4">
            {imageUrls.map((url, imgIndex) => (
              <div
                key={imgIndex}
                className="relative group w-80 h-80"
                style={{ minWidth: '8rem', minHeight: '8rem' }}
              >
                <img
                  src={url}
                  alt={`Uploaded image ${imgIndex + 1}`}
                  className="w-full h-full object-contain rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  onError={(e) => {
                    // Hide broken images
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg"></div>
                {/* Download button on hover */}
                <a
                  href={url}
                  download
                  className="hidden group-hover:flex absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 shadow transition-all items-center"
                  title="Tải xuống ảnh"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Simple download icon (SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      )
    }
  }

  // Handle MULTIPLE_CHOICE responses - they are semicolon-separated values
  if (question.question_type === 'MULTIPLE_CHOICE' && response) {
    const selectedChoices = response
      .split(';')
      .map((choice) => choice.trim())
      .filter((choice) => choice)

    if (selectedChoices.length > 0) {
      return (
        <div className="space-y-2">
          <ul className="list-disc list-inside space-y-1">
            {selectedChoices.map((choice, choiceIndex) => (
              <li key={choiceIndex} className="text-gray-600">
                {choice}
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }

  // Default response display for other question types
  return <p className="text-gray-600">{response || 'Chưa có câu trả lời'}</p>
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

  // Combine the data and sort questions
  const quizData = attemptData
    ? {
        ...attemptData,
        body_quiz: {
          ...attemptData.body_quiz,
          questions: sortByKey(quizResponse?.data?.questions || [], 'created_at', {
            transform: (val) => new Date(val).getTime(),
          }),
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
          Kết quả ngày {format(new Date(quizData.quiz_date), 'Pp')} - {quizData.body_quiz?.title || 'Đánh giá cơ thể'}
        </p>
        <div className="md:space-y-6 space-y-4 text-lg text-gray-600">
          {quizData.body_quiz.questions &&
            quizData.body_quiz.questions.map((question, index) => (
              <div key={question.id} className="pb-4 border-b border-gray-100 last:border-b-0">
                <div className="font-medium text-gray-800 mb-3">
                  Câu hỏi {index + 1}: <HTMLRenderer content={question.title} className="prose-sm inline" />
                </div>
                <QuestionResponse question={question} response={quizData.responses[index]} index={index} />
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

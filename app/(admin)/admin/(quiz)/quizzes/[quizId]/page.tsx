'use client'

import { useParams } from 'next/navigation'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditQuizForm } from '@/components/forms/edit-quiz-form'

import { useQuery } from '@/hooks/use-query'
import { getQuiz } from '@/network/server/body-quiz'

export default function QuizDetailPage() {
  const { quizId } = useParams()

  const _quizId = (Array.isArray(quizId) ? quizId[0] : quizId) as string

  const { data, isLoading, error } = useQuery(() => getQuiz(_quizId))

  if (isLoading) {
    return <div>Đang tải ...</div>
  }

  if (error) {
    return <div>Lỗi khi tải quizzes: {error.message}</div>
  }

  return (
    <ContentLayout title="Quiz Detail">
      <EditQuizForm data={data?.data} />
    </ContentLayout>
  )
}

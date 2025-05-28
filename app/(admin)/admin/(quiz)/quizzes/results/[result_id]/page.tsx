import * as React from 'react'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { QuizResultForm } from '@/components/forms/quiz-result-form'
import { getUserBodyQuizzById } from '@/network/server/user-body-quizz'

export default async function EditQuizResultPage({ params }: { params: Promise<{ result_id: string }> }) {
  const { result_id } = await params
  const result = await getUserBodyQuizzById(result_id)

  return (
    <ContentLayout title="Kết quả quiz">
      <QuizResultForm data={result.data} isEdit={true} />
    </ContentLayout>
  )
}

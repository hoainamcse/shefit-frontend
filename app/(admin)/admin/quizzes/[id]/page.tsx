import type { BodyQuiz } from '@/models/body-quiz'

import { ContentLayout } from '@/components/admin-panel/content-layout'

import { BodyQuizView } from './body-quiz-view'

export default async function QuizPage({ params }: { params: Promise<{ id: BodyQuiz['id'] }> }) {
  const { id: quiz_id } = await params

  return (
    <ContentLayout title="Chỉnh sửa quiz">
      <BodyQuizView quizID={quiz_id} />
    </ContentLayout>
  )
}

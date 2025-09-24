import type { BodyQuizUser } from '@/models/body-quiz'

import { ContentLayout } from '@/components/admin-panel/content-layout'

import { UserBodyQuizzesTable } from './body-quiz-view'

export default async function EditQuizResultPage({ params }: { params: Promise<{ user_id: BodyQuizUser['id'] }> }) {
  const { user_id } = await params

  return (
    <ContentLayout title={`Kết quả quiz của người dùng ${user_id}`}>
      <UserBodyQuizzesTable userId={user_id} />
    </ContentLayout>
  )
}

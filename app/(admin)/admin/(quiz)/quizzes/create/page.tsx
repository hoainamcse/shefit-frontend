import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditQuizForm } from '@/components/forms/edit-quiz-form'

export default function CreateQuizPage() {
  return (
    <ContentLayout title="Thêm quiz">
      <EditQuizForm />
    </ContentLayout>
  )
}

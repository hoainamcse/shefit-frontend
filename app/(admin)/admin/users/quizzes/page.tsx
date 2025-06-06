import { ContentLayout } from '@/components/admin-panel/content-layout'
import { BodyQuizUsersTable } from '@/components/data-table/body-quiz-users-table'

export default function BodyQuizUsersPage() {
  return (
    <ContentLayout title="Danh sách người dùng làm quiz">
      <BodyQuizUsersTable />
    </ContentLayout>
  )
}

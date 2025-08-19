import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ExercisesTable } from '@/components/data-table/exercises-table'

export default function ExercisesPage() {
  return (
    <ContentLayout title="Thư viện động tác">
      <ExercisesTable />
    </ContentLayout>
  )
}

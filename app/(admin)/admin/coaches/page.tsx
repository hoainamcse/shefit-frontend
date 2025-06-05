import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CoachesTable } from '@/components/data-table/coaches-table'

export default function CoachesPage() {
  return (
    <ContentLayout title="Danh sách HLV">
      <CoachesTable />
    </ContentLayout>
  )
}

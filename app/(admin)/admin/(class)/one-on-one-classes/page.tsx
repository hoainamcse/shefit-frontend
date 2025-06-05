import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CoursesTable } from '@/components/data-table/courses-table'

export default function OneOnOneClassesPage() {
  return (
    <ContentLayout title="Danh sách khoá tập 1:1">
      <CoursesTable isOneOnOne />
    </ContentLayout>
  )
}

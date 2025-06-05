import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CoursesTable } from '@/components/data-table/courses-table'

export default function CoursesPage() {
  return (
    <ContentLayout title="Danh sách khoá tập Zoom">
      <CoursesTable courseFormat="live" />
    </ContentLayout>
  )
}

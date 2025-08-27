import { ContentLayout } from '@/components/admin-panel/content-layout'
import { TopicsTable } from '@/components/data-table/topics-table'

export default function BlogsPage() {
  return (
    <ContentLayout title="Danh sách chủ đề">
      <TopicsTable />
    </ContentLayout>
  )
}

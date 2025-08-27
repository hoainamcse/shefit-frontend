import { ContentLayout } from '@/components/admin-panel/content-layout'
import { BlogsTable } from '@/components/data-table/blogs-table'

export default function BlogsPage() {
  return (
    <ContentLayout title="Danh sách bài viết">
      <BlogsTable />
    </ContentLayout>
  )
}

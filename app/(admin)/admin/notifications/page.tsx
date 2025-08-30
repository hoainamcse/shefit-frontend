import { ContentLayout } from '@/components/admin-panel/content-layout'
import { NotificationsTable } from '@/components/data-table/notifications-table'

export default function NotificationsPage() {
  return (
    <ContentLayout title="Danh sách Thông báo">
      <NotificationsTable />
    </ContentLayout>
  )
}

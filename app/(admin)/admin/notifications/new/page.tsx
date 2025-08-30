import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditNotificationForm } from '@/components/forms/edit-notification-form'

export default async function CreateNotificationPage() {
  return (
    <ContentLayout title="Thêm Thông báo">
      <EditNotificationForm />
    </ContentLayout>
  )
}

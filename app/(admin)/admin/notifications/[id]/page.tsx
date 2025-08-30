import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditNotificationForm } from '@/components/forms/edit-notification-form'
import { getNotification } from '@/network/server/notifications'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const notification = await getNotification(Number(id))

  return (
    <ContentLayout title="Chỉnh sửa Thông báo">
      <EditNotificationForm data={notification.data} />
    </ContentLayout>
  )
}

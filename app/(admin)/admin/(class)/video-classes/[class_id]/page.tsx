import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditClassForm } from '@/components/forms/edit-class-form'

export default async function VideoClassPage({ params }: { params: Promise<{ class_id: string }> }) {
  const { class_id } = await params

  return (
    <ContentLayout title="Video Class">
      <EditClassForm format="video" />
    </ContentLayout>
  )
}

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditClassForm } from '@/components/forms/edit-class-form'

export default function VideoClassPage() {
  return (
    <ContentLayout title="Video Class">
      <EditClassForm format="video" />
    </ContentLayout>
  )
}

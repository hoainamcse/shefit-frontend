import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditClassForm } from '@/components/forms/edit-class-form'

export default function LiveClassPage() {
  return (
    <ContentLayout title="Live Class">
      <EditClassForm />
    </ContentLayout>
  )
}

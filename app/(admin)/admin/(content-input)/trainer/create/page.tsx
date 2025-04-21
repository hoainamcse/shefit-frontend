import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateTrainerForm } from '@/components/forms/create-trainer-form'

export default function CreateTrainerPage() {
  return (
    <ContentLayout title="Tạo mới huấn luyện viên">
      <CreateTrainerForm isEdit={false} />
    </ContentLayout>
  )
}

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateTrainerForm } from '@/components/forms/create-trainer-form'

export default function CreateTrainerPage() {
  return (
    <ContentLayout title="Cập nhật thông tin huấn luyện viên">
      <CreateTrainerForm isEdit={true} />
    </ContentLayout>
  )
}

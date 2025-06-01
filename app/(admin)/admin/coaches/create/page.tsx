import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateCoachForm } from '@/components/forms/create-coach-form'

export default function CreateCoachPage() {
  return (
    <ContentLayout title="Tạo mới huấn luyện viên">
      <CreateCoachForm isEdit={false} />
    </ContentLayout>
  )
}

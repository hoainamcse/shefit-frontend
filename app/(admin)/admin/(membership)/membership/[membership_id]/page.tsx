import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateMembershipForm } from '@/components/forms/create-membership-form'

export default function EditMembershipPage() {
  return (
    <ContentLayout title="Tạo gói thành viên">
      <CreateMembershipForm isEdit={true} />
    </ContentLayout>
  )
}

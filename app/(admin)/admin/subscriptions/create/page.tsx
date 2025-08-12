import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateSubscriptionForm } from '@/components/forms/create-subscription-form'

export default function CreateSubscriptionPage() {
  return (
    <ContentLayout title="Thêm gói tập">
      <CreateSubscriptionForm isEdit={false} />
    </ContentLayout>
  )
}

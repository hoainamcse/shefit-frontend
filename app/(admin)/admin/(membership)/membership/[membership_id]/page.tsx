import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateMembershipForm } from '@/components/forms/create-membership-form'
import { getSubscription } from '@/network/server/subcriptions-admin'

export default async function EditMembershipPage({ params }: { params: Promise<{ membership_id: string }> }) {
  const { membership_id } = await params
  const subscriptionRes = await getSubscription(Number(membership_id))
  return (
    <ContentLayout title="Tạo gói thành viên">
      <CreateMembershipForm isEdit={true} data={subscriptionRes.data} />
    </ContentLayout>
  )
}

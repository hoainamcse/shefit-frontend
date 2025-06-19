import type { Subscription } from '@/models/subscription'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateMembershipForm } from '@/components/forms/create-membership-form'
import { getSubscription } from '@/network/client/subscriptions'

export default async function EditMembershipPage({
  params,
}: {
  params: Promise<{ membership_id: Subscription['id'] }>
}) {
  const { membership_id } = await params
  const subscriptionRes = await getSubscription(membership_id)
  return (
    <ContentLayout title="Chỉnh sửa gói tập">
      <CreateMembershipForm isEdit={true} data={subscriptionRes.data || {}} />
    </ContentLayout>
  )
}

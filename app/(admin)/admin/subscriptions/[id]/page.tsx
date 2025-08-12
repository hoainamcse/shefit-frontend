import type { Subscription } from '@/models/subscription'
import { getSubscription } from '@/network/server/subscriptions'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateSubscriptionForm } from '@/components/forms/create-subscription-form'

export default async function SubscriptionPage({ params }: { params: Promise<{ id: Subscription['id'] }> }) {
  const { id: subscription_id } = await params
  const data = await getSubscription(subscription_id, { include_relationships: true })

  return (
    <ContentLayout title="Chỉnh sửa gói tập">
      <CreateSubscriptionForm isEdit data={data.data} />
    </ContentLayout>
  )
}

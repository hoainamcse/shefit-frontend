import { ContentLayout } from '@/components/admin-panel/content-layout'
import { SubscriptionsTable } from '@/components/data-table/subscriptions-table'

export default function DishesPage() {
  return (
    <ContentLayout title="Gói Member">
      <SubscriptionsTable />
    </ContentLayout>
  )
}

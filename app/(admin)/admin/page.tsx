import { DashboardContent } from '@/components/admin-panel/dashboard/dashboard-content'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getDashboard } from '@/network/client/configurations'

export default async function DashboardPage() {
  const data = await getDashboard()

  return (
    <ContentLayout title="Dashboard">
      <DashboardContent data={data.data} />
    </ContentLayout>
  )
}

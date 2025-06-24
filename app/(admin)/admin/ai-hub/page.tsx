import { ContentLayout } from '@/components/admin-panel/content-layout'
import { AIHubTable } from '@/components/data-table/ai-hub-table'

export default function AIHubPage() {
  return (
    <ContentLayout title="AI Hub">
      <AIHubTable />
    </ContentLayout>
  )
}

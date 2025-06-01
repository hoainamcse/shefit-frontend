import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getCourse } from '@/network/server/courses-admin'
import LiveClassPageClient from './page-client'

export default async function LiveClassPage({ params }: { params: Promise<{ class_id: string }> }) {
  const { class_id } = await params
  const data = await getCourse(class_id)

  return (
    <ContentLayout title="Khoá tập Zoom">
      <LiveClassPageClient data={data} />
    </ContentLayout>
  )
}

import { ContentLayout } from '@/components/admin-panel/content-layout'
import VideoClassPageClient from './page-client'
import { getCourse } from '@/network/server/courses-admin'

export default async function VideoClassPage({ params }: { params: Promise<{ class_id: string }> }) {
  const { class_id } = await params
  const data = await getCourse(class_id)

  return (
    <ContentLayout title="Video Class">
      <VideoClassPageClient data={data} />
    </ContentLayout>
  )
}

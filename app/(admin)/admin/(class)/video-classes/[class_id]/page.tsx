import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateCourseForm } from '@/components/forms/create-course-form'

export default async function VideoClassPage({ params }: { params: Promise<{ class_id: string }> }) {
  const { class_id } = await params

  return (
    <ContentLayout title="Video Class">
      <CreateCourseForm format="video" />
    </ContentLayout>
  )
}

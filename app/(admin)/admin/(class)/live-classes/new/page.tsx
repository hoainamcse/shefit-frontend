import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateCourseForm } from '@/components/forms/create-course-form'

export default function LiveClassPage() {
  return (
    <ContentLayout title="Live Class">
      <CreateCourseForm format="live" />
    </ContentLayout>
  )
}

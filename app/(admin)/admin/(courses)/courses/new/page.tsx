'use client'

import type { CourseFormat } from '@/models/course'

import { useRouter, useSearchParams } from 'next/navigation'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditCourseForm } from '@/components/forms/edit-course-form'
import { MainButton } from '@/components/buttons/main-button'

export default function CreateCoursePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseFormat = searchParams?.get('course_format') as CourseFormat | undefined
  const isOneOnOne = searchParams?.get('is_one_on_one') === 'true'

  if (!courseFormat) {
    return (
      <ContentLayout title="Thêm khoá tập">
        <div className="text-destructive">Vui lòng chọn định dạng khoá tập.</div>
        <div className="flex gap-4 mt-4">
          <MainButton
            text="Khoá tập video"
            onClick={() => router.push(`/admin/courses/new?course_format=video&${searchParams?.toString()}`)}
          />
          <MainButton
            text="Khoá tập Zoom"
            onClick={() => router.push(`/admin/courses/new?course_format=live&${searchParams?.toString()}`)}
          />
        </div>
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title="Thêm khoá tập">
      <EditCourseForm
        onSuccess={(data) => router.push(`/admin/courses/${data.id}`)}
        courseFormat={courseFormat}
        isOneOnOne={isOneOnOne}
      />
    </ContentLayout>
  )
}

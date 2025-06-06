import type { CourseFormat } from '@/models/course'

import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CoursesTable } from '@/components/data-table/courses-table'

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const courseFormat = (await searchParams).course_format as CourseFormat | undefined
  const isOneOnOne = (await searchParams).is_one_on_one === 'true'

  return (
    <ContentLayout title="Danh sách khoá tập">
      <CoursesTable courseFormat={courseFormat} isOneOnOne={isOneOnOne} />
    </ContentLayout>
  )
}

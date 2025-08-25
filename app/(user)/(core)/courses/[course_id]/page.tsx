import type { Course } from '@/models/course'

import CoursePageClient from './page.client'

export default async function CourseVideoClasses({ params }: { params: Promise<{ course_id: Course['id'] }> }) {
  const { course_id } = await params

  return <CoursePageClient courseID={course_id} />
}

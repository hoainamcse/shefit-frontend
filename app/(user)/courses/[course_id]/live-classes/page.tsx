'use-client'

import { Course } from '@/models/course'
import CourseDetail from '../../_components/CourseDetail'

export default async function CourseLiveClasses({ params }: { params: Promise<{ course_id: Course['id'] }> }) {
  const { course_id } = await params
  return <CourseDetail courseId={course_id} typeCourse="live" />
}

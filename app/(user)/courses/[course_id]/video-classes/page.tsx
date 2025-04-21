import CourseDetail from '../../_components/CourseDetail'

export default async function CourseVideoClasses({ params }: { params: Promise<{ course_id: string }> }) {
  const { course_id } = await params
  return <CourseDetail courseId={course_id} typeCourse="video" />
}

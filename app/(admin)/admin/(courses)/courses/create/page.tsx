import { Suspense } from 'react'
import { Spinner } from '@/components/spinner'
import CreateCourseClient from './_components/create-course-client'

export default function CreateCoursePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center"><Spinner className="bg-ring dark:bg-white" /></div>}>
      <CreateCourseClient />
    </Suspense>
  )
}

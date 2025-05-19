import * as React from 'react'
import CreateExerciseForm from '@/components/forms/create-exercise-form'
import { ContentLayout } from '@/components/admin-panel/content-layout'

export default function CreateExercisePage() {
  return (
    <ContentLayout title="Thêm bài tập">
      <CreateExerciseForm isEdit={false} />
    </ContentLayout>
  )
}

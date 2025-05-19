import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateExerciseForm from '@/components/forms/create-exercise-form'
import { getExerciseById } from '@/network/server/exercise'

export default async function AccountPage({ params }: { params: Promise<{ exercise_id: string }> }) {
  const { exercise_id } = await params
  const exercise = await getExerciseById(exercise_id)

  return (
    <ContentLayout title="Cập nhật bài tập">
      <CreateExerciseForm data={exercise.data || {}} isEdit />
    </ContentLayout>
  )
}

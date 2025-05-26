import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateTrainerForm } from '@/components/forms/create-trainer-form'
import { getCoach } from '@/network/server/coaches'

export default async function CreateTrainerPage({ params }: { params: Promise<{ coach_id: string }> }) {
  const { coach_id } = await params
  const coach = await getCoach(coach_id)
  return (
    <ContentLayout title="Cập nhật thông tin huấn luyện viên">
      <CreateTrainerForm isEdit={true} data={coach.data} />
    </ContentLayout>
  )
}

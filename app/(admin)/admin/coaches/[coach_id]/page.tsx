import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CreateCoachForm } from '@/components/forms/create-coach-form'
import { getCoach } from '@/network/server/coaches'

export default async function CreateTrainerPage({ params }: { params: Promise<{ coach_id: string }> }) {
  const { coach_id } = await params
  const coach = await getCoach(coach_id)
  return (
    <ContentLayout title="Cập nhật thông tin huấn luyện viên">
      <CreateCoachForm isEdit={true} data={coach.data} />
    </ContentLayout>
  )
}

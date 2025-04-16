import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateMealPlanForm from '@/components/forms/create-meal-plan-form'

export default function CreateMealPlanPage() {
  return (
    <ContentLayout title="Tạo thực đơn">
      <CreateMealPlanForm isEdit={false} data={undefined} />
    </ContentLayout>
  )
}

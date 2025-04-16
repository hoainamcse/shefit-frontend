import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateMealPlanForm from '@/components/forms/create-meal-plan-form'

export default function EditMealPlanPage() {
  return (
    <ContentLayout title="Cập nhật thực đơn">
      <CreateMealPlanForm isEdit={true} data={undefined} />
    </ContentLayout>
  )
}

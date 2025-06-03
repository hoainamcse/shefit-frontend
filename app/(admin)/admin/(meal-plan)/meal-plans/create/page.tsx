import { ContentLayout } from '@/components/admin-panel/content-layout'
import { EditMealPlanForm } from '@/components/forms/edit-meal-plan-form'

export default function CreateMealPlanPage() {
  return (
    <ContentLayout title="Tạo thực đơn">
      <EditMealPlanForm />
    </ContentLayout>
  )
}

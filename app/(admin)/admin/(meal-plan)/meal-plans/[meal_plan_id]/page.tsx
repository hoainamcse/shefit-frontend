import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateMealPlanForm from '@/components/forms/create-meal-plan-form'
import { getMealPlanDetails } from '@/network/server/meal-plans'

export default async function EditMealPlanPage({ params }: { params: Promise<{ meal_plan_id: string }> }) {
  const { meal_plan_id } = await params
  const mealPlan = await getMealPlanDetails(meal_plan_id)

  return (
    <ContentLayout title="Cập nhật thực đơn">
      <CreateMealPlanForm isEdit={true} data={mealPlan.data} />
    </ContentLayout>
  )
}

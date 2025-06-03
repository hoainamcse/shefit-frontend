import { ContentLayout } from '@/components/admin-panel/content-layout'
import { MealPlansTable } from '@/components/data-table/meal-plans-table'

export default function DishesPage() {
  return (
    <ContentLayout title="Danh sách thực đơn">
      <MealPlansTable />
    </ContentLayout>
  )
}

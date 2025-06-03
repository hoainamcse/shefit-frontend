import { ContentLayout } from '@/components/admin-panel/content-layout'
import { DishesTable } from '@/components/data-table/dishes-table'

export default function DishesPage() {
  return (
    <ContentLayout title="Thư viện món ăn">
      <DishesTable />
    </ContentLayout>
  )
}

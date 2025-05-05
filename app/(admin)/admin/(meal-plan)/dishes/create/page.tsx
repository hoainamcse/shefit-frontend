import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateDishForm from '@/components/forms/create-dish-form'

export default function CreateDishPage() {
  return (
    <ContentLayout title="Tạo món ăn">
      <CreateDishForm isEdit={false} />
    </ContentLayout>
  )
}

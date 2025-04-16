import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateDishForm from '@/components/forms/create-dish-form'

export default function EditDishPage() {
  return (
    <ContentLayout title="Cập nhật món ăn">
      <CreateDishForm isEdit={true} data={undefined} />
    </ContentLayout>
  )
}

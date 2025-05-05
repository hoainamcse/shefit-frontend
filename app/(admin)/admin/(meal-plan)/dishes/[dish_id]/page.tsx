import { ContentLayout } from '@/components/admin-panel/content-layout'
import CreateDishForm from '@/components/forms/create-dish-form'
import { getDetailDish } from '@/network/server/dish'

export default async function EditDishPage({ params }: { params: Promise<{ dish_id: string }> }) {
  const { dish_id } = await params
  const dish = await getDetailDish(dish_id)
  console.log('dish', dish)
  return (
    <ContentLayout title="Cập nhật món ăn">
      <CreateDishForm isEdit={true} data={dish.data} />
    </ContentLayout>
  )
}

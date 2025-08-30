import CreateProductForm from '@/components/forms/create-product-form'
import { getProduct } from '@/network/server/products'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const productRes = await getProduct(id)

  return <CreateProductForm isEdit={true} data={productRes.data} />
}

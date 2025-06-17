import { ContentLayout } from '@/components/admin-panel/content-layout'
import { ProductsTable } from '@/components/data-table/products-table'

export default function ProductsPage() {
  return (
    <ContentLayout title="Danh sách sản phẩm">
      <ProductsTable />
    </ContentLayout>
  )
}

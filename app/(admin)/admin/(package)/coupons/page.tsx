import { ContentLayout } from '@/components/admin-panel/content-layout'
import { CouponsTable } from '@/components/data-table/coupons-table'

export default function DishesPage() {
  return (
    <ContentLayout title="Mã khuyến mãi">
      <CouponsTable couponType="subscription" />
    </ContentLayout>
  )
}

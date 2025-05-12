import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Cart } from '@/models/cart'
import { getCart } from '@/network/server/cart'

const AVAILABLE_PAYMENT_METHODS = [
  { value: 'not_decided', label: 'Not decided' },
  { value: 'vietqr', label: 'VietQR' },
  { value: 'cod', label: 'COD' },
]

export default async function OrderDetailPage({ params }: { params: Promise<{ order_id: string }> }) {
  const { order_id } = await params
  const orderDetail: Cart = (await getCart(Number(order_id))).data

  return (
    <ContentLayout title="Chi tiết đơn hàng">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">Đơn hàng</h2>
          <div className="space-y-4">
            {orderDetail?.product_variants.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-4 hover:bg-indigo-50 p-2 rounded transition-colors"
              >
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image_urls[0]}
                    alt={item.product_name}
                    fill
                    className="object-cover rounded-md shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-indigo-900">{item.product_name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="text-indigo-600">Kích cỡ:</span> {item?.size?.size}
                    <span className="text-indigo-600">Màu sắc:</span> {item?.color?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="text-indigo-600">Số lượng:</span> {item.quantity}
                  </p>
                  <p className="font-medium mt-1 text-green-600">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-indigo-100">
            <div className="flex justify-between items-center">
              <span className="font-medium text-indigo-800">Tổng tiền</span>
              <span className="text-green-600 font-bold">
                {formatCurrency(
                  orderDetail?.product_variants?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-rose-500">
          <h2 className="text-xl font-semibold mb-4 text-rose-700">Thông tin khách hàng</h2>
          <div className="space-y-4">
            <div className="hover:bg-rose-50 p-2 rounded transition-colors">
              <h3 className="font-medium text-rose-700">Tên</h3>
              <p className="text-gray-800">{orderDetail?.user_name}</p>
            </div>
            <div className="hover:bg-rose-50 p-2 rounded transition-colors">
              <h3 className="font-medium text-rose-700">Số điện thoại</h3>
              <p className="text-gray-800">{orderDetail?.telephone_number}</p>
            </div>
            <div className="hover:bg-rose-50 p-2 rounded transition-colors">
              <h3 className="font-medium text-rose-700">Địa chỉ</h3>
              <p className="text-gray-800">
                {orderDetail?.address}, {orderDetail?.city}
              </p>
            </div>
            <div className="hover:bg-rose-50 p-2 rounded transition-colors">
              <h3 className="font-medium text-rose-700">Phương thức thanh toán</h3>
              <p className="text-gray-800">
                {AVAILABLE_PAYMENT_METHODS.find((method) => method.value === orderDetail?.payment_method)?.label}
              </p>
            </div>
            {orderDetail?.notes && (
              <div className="hover:bg-rose-50 p-2 rounded transition-colors">
                <h3 className="font-medium text-rose-700">Ghi chú</h3>
                <p className="text-gray-800">{orderDetail?.notes}</p>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-rose-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-rose-600">Phí giao hàng</span>
                <span className="text-green-600">{formatCurrency(orderDetail?.shipping_fee || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-rose-800">Tổng tiền</span>
                <span className="font-medium text-lg text-green-600">{formatCurrency(orderDetail?.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}

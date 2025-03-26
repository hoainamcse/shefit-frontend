'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'
import { ContentLayout } from '@/components/admin-panel/content-layout'

interface OrderItem {
  id: string
  productId: string
  name: string
  image: string
  size: string
  color: string
  price: number
  quantity: number
}

interface CustomerInfo {
  name: string
  phone: string
  city: string
  address: string
  deliveryCost: number
  paymentMethod: string
  note?: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch order details using order_id from params
    // This is a mock data for demonstration
    setOrderItems([
      {
        id: '1',
        productId: 'p1',
        name: 'Product Name 1',
        image: 'https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Main-Ab-Roller.png?v=1636587473',
        size: 'M',
        color: 'Black',
        price: 29.99,
        quantity: 2,
      },
      {
        id: '2',
        productId: 'p2',
        name: 'Product Name 2',
        image: 'https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Main-Ab-Roller.png?v=1636587473',
        size: 'L',
        color: 'Red',
        price: 39.99,
        quantity: 1,
      },
      {
        id: '3',
        productId: 'p3',
        name: 'Product Name 3',
        image: 'https://cdn.shopify.com/s/files/1/0574/1215/7598/t/16/assets/acf.Main-Ab-Roller.png?v=1636587473',
        size: 'XL',
        color: 'Blue',
        price: 49.99,
        quantity: 3,
      },
      // Add more mock items as needed
    ])

    setCustomerInfo({
      name: 'John Doe',
      phone: '+1234567890',
      city: 'New York',
      address: '123 Main St, Apt 4B',
      deliveryCost: 5.99,
      paymentMethod: 'Credit Card',
      note: 'Please deliver in the evening',
    })

    setLoading(false)
  }, [params.order_id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <ContentLayout title="Chi tiết đơn hàng">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">Đơn hàng</h2>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 border-b pb-4 hover:bg-indigo-50 p-2 rounded transition-colors"
              >
                <div className="relative w-20 h-20">
                  <Image src={item.image} alt={item.name} fill className="object-cover rounded-md shadow-sm" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-indigo-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="text-indigo-600">Kích cỡ:</span> {item.size} |{' '}
                    <span className="text-indigo-600">Màu sắc:</span> {item.color}
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
                {formatCurrency(totalPrice)}
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
              <p className="text-gray-800">{customerInfo?.name}</p>
            </div>
            <div className="hover:bg-rose-50 p-2 rounded transition-colors">
              <h3 className="font-medium text-rose-700">Số điện thoại</h3>
              <p className="text-gray-800">{customerInfo?.phone}</p>
            </div>
            <div className="hover:bg-rose-50 p-2 rounded transition-colors">
              <h3 className="font-medium text-rose-700">Địa chỉ</h3>
              <p className="text-gray-800">
                {customerInfo?.address}, {customerInfo?.city}
              </p>
            </div>
            <div className="hover:bg-rose-50 p-2 rounded transition-colors">
              <h3 className="font-medium text-rose-700">Phương thức thanh toán</h3>
              <p className="text-gray-800">{customerInfo?.paymentMethod}</p>
            </div>
            {customerInfo?.note && (
              <div className="hover:bg-rose-50 p-2 rounded transition-colors">
                <h3 className="font-medium text-rose-700">Ghi chú</h3>
                <p className="text-gray-800">{customerInfo.note}</p>
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-rose-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-rose-600">Phí giao hàng</span>
                <span className="text-green-600">{formatCurrency(customerInfo?.deliveryCost || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-rose-800">Tổng tiền</span>
                <span className="font-medium text-lg text-green-600">
                  {formatCurrency(totalPrice + (customerInfo?.deliveryCost || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentLayout>
  )
}

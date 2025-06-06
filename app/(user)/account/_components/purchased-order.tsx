'use client'

import Link from 'next/link'
import { getUserCart } from '@/network/server/user-cart'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-context'

export default function PurchasedOrder() {
  const { userId } = useAuth()
  const [deliveredCarts, setDeliveredCarts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const cartsResponse = await getUserCart(Number(userId))
        console.log('Delivered carts response:', cartsResponse)

        const filtered = Array.isArray(cartsResponse?.data)
          ? cartsResponse.data.filter((userCart: any) => userCart?.cart?.status === 'delivered')
          : []

        console.log('Filtered delivered carts:', filtered)
        setDeliveredCarts(filtered)
      } catch (error) {
        console.error('Error fetching purchased order data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`
  }

  if (loading) {
    return <div className="flex justify-center mt-20">Loading...</div>
  }

  if (!deliveredCarts.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 w-full">
        <p className="text-2xl mb-6 text-center">Bạn chưa có đơn hàng nào, xem sản phẩm của chúng tôi</p>
        <Link href="/products">
          <Button className="h-[60px] w-[586px] bg-[#13D8A7] text-white px-6 py-2 rounded-full text-lg transition-colors">
            Mua ngay
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full">
      {deliveredCarts.map((userCart) => {
        // Access the nested cart object
        const cart = userCart.cart

        // Get the first product variant's image, if available
        const thumbnailImage =
          cart.product_variants &&
          cart.product_variants.length > 0 &&
          cart.product_variants[0].image_urls &&
          cart.product_variants[0].image_urls.length > 0
            ? cart.product_variants[0].image_urls[0]
            : '/images/product-thumbnail.jpg'

        return (
          <div key={`cart-${cart.id}`} className="flex items-center border-b border-gray-100 py-4 justify-between">
            <div className="flex items-center gap-10 text-xl">
              <div className="size-[148px] relative mr-4">
                <img src={thumbnailImage} alt="Product thumbnail" className="object-cover aspect-square rounded-lg" />
              </div>
              <div className="flex-grow">
                <div className="font-bold">Đơn Hàng Ngày</div>
                <div className="text-gray-500">{formatDate(cart.created_at)}</div>
              </div>
              <div className="text-center px-8">
                <div className="font-bold text-[#737373]">{cart.total.toLocaleString()} vnđ</div>
              </div>
            </div>
            <Link href={`/account/cart/${cart.id}`} className="text-[#00C7BE] hover:underline px-4">
              Xem chi tiết
            </Link>
          </div>
        )
      })}
    </div>
  )
}

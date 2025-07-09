'use client'

import Link from 'next/link'
import { getUserCart } from '@/network/client/users'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'
import { useRouter } from 'next/navigation'

export default function PurchasedOrder() {
  const { session } = useSession()
  const [deliveredCarts, setDeliveredCarts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      if (!session) {
        setLoading(false)
        return
      }

      try {
        const cartsResponse = await getUserCart(Number(session?.userId))
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
  }, [session])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`
  }

  const handleBuyNow = () => {
    router.push('/products')
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!deliveredCarts.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 w-full">
        <p className="text-2xl mb-6 text-center">Bạn chưa có đơn hàng nào, xem sản phẩm của chúng tôi</p>
        <Button
          onClick={handleBuyNow}
          className="h-[60px] w-full max-w-[586px] bg-[#13D8A7] text-white px-6 py-2 rounded-full text-lg transition-colors"
        >
          Mua ngay
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {deliveredCarts.map((userCart) => {
        const cart = userCart.cart
        const thumbnailImage =
          cart.product_variants &&
          cart.product_variants.length > 0 &&
          cart.product_variants[0].image_urls &&
          cart.product_variants[0].image_urls.length > 0
            ? cart.product_variants[0].image_urls[0]
            : '/images/product-thumbnail.jpg'

        return (
          <div key={`cart-${cart.id}`} className="flex items-center border-b border-gray-100 py-4 justify-between">
            <div className="flex items-center gap-2 lg:gap-10 text-lg w-full">
              <div className="relative mr-4 flex gap-5">
                <img
                  src={thumbnailImage}
                  alt="Product thumbnail"
                  className="object-cover aspect-square rounded-lg w-[148px] h-[148px]"
                />
                <div className="flex flex-col justify-center">
                  <div className="font-bold">Đơn Hàng Ngày</div>
                  <div className="text-gray-500">{formatDate(cart.created_at)}</div>
                </div>
                <div className="text-center px-8 flex items-center">
                  <div className="font-bold text-[#737373]">{cart.total.toLocaleString()} vnđ</div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <Link href={`/account/cart/${cart.id}`} className="text-[#00C7BE] hover:underline whitespace-nowrap">
                Xem chi tiết
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

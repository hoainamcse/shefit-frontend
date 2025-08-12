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
      setLoading(true)

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
        <p className="text-lg md:text-xl mb-6 text-center">Bạn chưa có đơn hàng nào, xem sản phẩm của chúng tôi</p>
        <Button
          onClick={handleBuyNow}
          className="md:h-[60px] h-[50px] w-full max-w-[586px] bg-[#13D8A7] text-white px-6 py-2 rounded-full text-base transition-colors"
        >
          Mua ngay
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto">
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
            <div className="flex items-center gap-2 lg:gap-10 text-base w-full">
              <div className="flex gap-4 w-full">
                <img
                  src={thumbnailImage}
                  alt="Product thumbnail"
                  className="object-cover aspect-square rounded-lg lg:w-[148px] lg:h-[148px] w-[85px] h-[85px]"
                />
                <div className="flex flex-col justify-center">
                  <div className="font-bold text-sm lg:text-lg">Đơn Hàng Ngày</div>
                  <div className="text-gray-500 text-sm lg:text-lg">{formatDate(cart.created_at)}</div>
                </div>
                <div className="flex justify-end ml-auto">
                  <div className="flex flex-col justify-center text-end">
                    <div className="flex items-center justify-end">
                      <div className="font-bold text-[#737373] text-sm lg:text-lg">
                        {cart.total.toLocaleString()} vnđ
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link
                        href={`/account/cart/${cart.id}`}
                        className="text-[#00C7BE] hover:underline whitespace-nowrap text-sm lg:text-lg"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

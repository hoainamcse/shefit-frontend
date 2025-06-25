'use client'
import { BinIcon } from '@/components/icons/BinIcon'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FormDelivery from './FormDelivery'
import { removeCart } from '@/network/server/cart'
import { getUserCart } from '@/network/server/user-cart'
import { toast } from 'sonner'
import { useSession } from '@/components/providers/session-provider'
import { useEffect, useState } from 'react'
import { UserCart } from '@/models/user-cart'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'

export default function CurrentCart() {
  const [pendingCarts, setPendingCarts] = useState<UserCart[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedCart, setSelectedCart] = useState<any>(null)
  const { session } = useSession()
  const router = useRouter()

  useEffect(() => {
    async function fetchCartData() {
      if (!session) {
        setLoading(false)
        return
      }
      try {
        const cartsRes = await getUserCart(Number(session.userId))
        const userCarts = (cartsRes?.data as UserCart[]) || []
        const pending = userCarts.filter(
          (item) => item?.cart?.status === 'pending' || item?.cart?.status === 'not_decided'
        )

        setPendingCarts(pending)
        if (pending.length > 0 && pending[0]?.cart) {
          setSelectedCart(pending[0]?.cart)
        }
      } catch (error) {
        toast.error('Không thể tải giỏ hàng. Vui lòng thử lại!')
      } finally {
        setLoading(false)
      }
    }
    fetchCartData()
  }, [session])

  const handleBuyNow = () => {
    router.push('/products')
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  if (!pendingCarts.length || !pendingCarts[0]?.cart?.product_variants?.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 w-full">
        <p className="text-2xl mb-6 text-center">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <Button
          onClick={handleBuyNow}
          disabled={processing}
          className="h-[60px] w-full max-w-[586px] bg-[#13D8A7] text-white px-6 py-2 rounded-full text-lg transition-colors"
        >
          {processing ? 'Đang xử lý...' : 'Mua ngay'}
        </Button>
      </div>
    )
  }

  const cartData = pendingCarts[0]?.cart
  const totalPrice = (cartData?.total - cartData?.shipping_fee).toLocaleString()

  const handleRemove = async (variantId: number) => {
    if (!session) {
      toast.error('Vui lòng đăng nhập để thực hiện thao tác này')
      return
    }

    try {
      setLoading(true)
      await removeCart(cartData?.id, variantId)
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!')

      const cartsRes = await getUserCart(Number(session.userId))

      const pending =
        cartsRes?.data?.filter(
          (item: UserCart) => item?.cart?.status === 'pending' || item?.cart?.status === 'not_decided'
        ) || []

      setPendingCarts(pending)
    } catch (error) {
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="xl:flex mt-10 w-full justify-between gap-20">
      <div className="w-full text-2xl max-lg:mb-20">
        {cartData?.product_variants.map((variant: any, index: number) => (
          <div key={`menu-${index}`} className="flex justify-between items-center mb-5">
            <img
              src={variant.image_urls?.[0]}
              alt={variant.name || ''}
              className="size-[148px] rounded-lg max-lg:w-[100px] mr-5"
            />
            <div className="w-full text-xl lg:text-md">
              <div className="font-medium">{variant.name || 'Sản phẩm'}</div>
              <div className="text-[#737373]">Size: {variant.size?.size}</div>
              <div className="text-[#737373]">Số lượng: {variant.quantity}</div>
            </div>
            <div className="text-[#737373] w-full text-xl lg:text-md">
              <div>
                <span>{variant.price?.toLocaleString()}</span> VNĐ
              </div>
              <div>
                Color: <span>{variant.color?.name}</span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex gap-2 bg-white hover:bg-white shadow-none items-center">
                  <BinIcon />
                  <p className="text-xl text-[#DA1515] items-center">Xóa</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] w-[350px]">
                <DialogHeader>
                  <DialogTitle>Xác nhận xóa sản phẩm?</DialogTitle>
                  <DialogDescription>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Hủy</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button className="bg-primary text-white" onClick={() => handleRemove(variant.id)}>
                      Xóa
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
        <div className="flex justify-between mt-20">
          <div>Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold">{totalPrice} VNĐ</div>
        </div>
      </div>
      {selectedCart ? (
        <FormDelivery cartData={selectedCart} />
      ) : (
        <div className="mt-6 text-center text-gray-500">Đang tải thông tin...</div>
      )}
    </div>
  )
}

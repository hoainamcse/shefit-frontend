'use client'
import { BinIcon } from '@/components/icons/BinIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import FormDelivery from './form-delivery'
import { removeCart, updateProductVariantQuantity } from '@/network/client/carts'
import { getUserCarts } from '@/network/client/users'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'
import { useEffect, useState } from 'react'
import { UserCart } from '@/models/user-cart'
import { getCoupons } from '@/network/server/coupons'
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
import { AddIcon } from '@/components/icons/AddIcon'
import { MinusIcon } from '@/components/icons/MinusIcon'

export default function CurrentCart() {
  const [pendingCarts, setPendingCarts] = useState<UserCart[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [selectedCart, setSelectedCart] = useState<any>(null)
  const [quantityUpdating, setQuantityUpdating] = useState<Record<number, boolean>>({})
  const [variantQuantities, setVariantQuantities] = useState<Record<number, number>>({})
  const [coupons, setCoupons] = useState<any[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const router = useRouter()
  const { session } = useSession()

  useEffect(() => {
    async function fetchCartData() {
      setLoading(true)

      if (!session) {
        setLoading(false)
        return
      }

      try {
        const cartsRes = await getUserCarts(session.userId)
        const userCarts = (cartsRes?.data as UserCart[]) || []
        const pending = userCarts.filter(
          (item) => item?.cart?.status === 'pending' || item?.cart?.status === 'not_decided'
        )

        setPendingCarts(pending)
        if (pending.length > 0 && pending[0]?.cart) {
          setSelectedCart(pending[0]?.cart)

          const quantities: Record<number, number> = {}
          pending[0]?.cart?.product_variants?.forEach((variant: any) => {
            quantities[variant.id] = variant.quantity || 1
          })
          setVariantQuantities(quantities)
        }
      } catch (error) {
        toast.error('Không thể tải giỏ hàng. Vui lòng thử lại!')
      } finally {
        setLoading(false)
      }
    }
    fetchCartData()
  }, [session])

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const couponsResponse = await getCoupons()
        if (couponsResponse?.data) {
          setCoupons(couponsResponse.data)
        }
      } catch (error) {
        console.error('Error fetching coupons:', error)
      }
    }

    fetchCoupons()
  }, [])

  const handleUpdateQuantity = async (variantId: number, newQuantity: number) => {
    if (!session) {
      toast.error('Vui lòng đăng nhập để thực hiện thao tác này')
      return
    }

    const validQuantity = Math.max(1, newQuantity)

    if (variantQuantities[variantId] === validQuantity) return

    try {
      setQuantityUpdating({ ...quantityUpdating, [variantId]: true })

      await updateProductVariantQuantity(pendingCarts[0]?.cart?.id, variantId, validQuantity)

      setVariantQuantities({ ...variantQuantities, [variantId]: validQuantity })

      const cartsRes = await getUserCarts(session.userId)
      const userCarts = (cartsRes?.data as UserCart[]) || []
      const pending = userCarts.filter(
        (item) => item?.cart?.status === 'pending' || item?.cart?.status === 'not_decided'
      )

      setPendingCarts(pending)
      if (pending.length > 0 && pending[0]?.cart) {
        const updatedCart = pending[0]?.cart
        setSelectedCart(updatedCart)

        if (appliedCoupon) {
          const newCartTotal = updatedCart.product_variants
            ? updatedCart.product_variants.reduce(
                (total: number, variant: any) => total + variant.price * variant.quantity,
                0
              )
            : 0

          let newDiscountAmount = 0
          if (appliedCoupon.discount_type === 'percentage') {
            newDiscountAmount = (newCartTotal * appliedCoupon.discount_value) / 100
          } else if (appliedCoupon.discount_type === 'fixed_amount') {
            newDiscountAmount = appliedCoupon.discount_value
          } else {
            newDiscountAmount = Number(appliedCoupon.discount_value || 0)
          }

          newDiscountAmount = Math.min(newDiscountAmount, newCartTotal)
          setDiscountAmount(newDiscountAmount)
        }
      }

      toast.success('Đã cập nhật số lượng sản phẩm!')
    } catch (error) {
      toast.error('Không thể cập nhật số lượng. Vui lòng thử lại!')

      const cartsRes = await getUserCarts(session.userId)
      const userCarts = (cartsRes?.data as UserCart[]) || []
      const pending = userCarts.filter(
        (item) => item?.cart?.status === 'pending' || item?.cart?.status === 'not_decided'
      )

      const quantities: Record<number, number> = { ...variantQuantities }
      pending[0]?.cart?.product_variants?.forEach((variant: any) => {
        quantities[variant.id] = variant.quantity || 1
      })
      setVariantQuantities(quantities)
    } finally {
      setQuantityUpdating({ ...quantityUpdating, [variantId]: false })
    }
  }

  const handleBuyNow = () => {
    router.push('/products')
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá')
      return
    }

    if (isApplyingCoupon) return

    try {
      setIsApplyingCoupon(true)

      if (!coupons.length) {
        const couponsResponse = await getCoupons()
        if (couponsResponse?.data) {
          setCoupons(couponsResponse.data)
        }
      }

      const matchingCoupon = coupons.find((coupon) => coupon.code?.toLowerCase() === couponCode.trim().toLowerCase())

      if (!matchingCoupon) {
        toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn')
        return
      }

      const cartTotal = pendingCarts[0]?.cart?.product_variants
        ? pendingCarts[0].cart.product_variants.reduce(
            (total: number, variant: any) => total + variant.price * variant.quantity,
            0
          )
        : 0

      let discount = 0
      if (matchingCoupon.discount_type === 'percentage') {
        discount = (cartTotal * matchingCoupon.discount_value) / 100
      } else if (matchingCoupon.discount_type === 'fixed_amount') {
        discount = matchingCoupon.discount_value
      } else {
        discount = Number(matchingCoupon.discount_value || 0)
      }

      discount = Math.min(discount, cartTotal)

      setAppliedCoupon(matchingCoupon)
      setDiscountAmount(discount)

      toast.success(`Đã áp dụng mã giảm giá: ${matchingCoupon.code}`)
    } catch (error) {
      console.error('Error applying coupon:', error)
      toast.error('Không thể áp dụng mã giảm giá. Vui lòng thử lại!')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setCouponCode('')
    toast.success('Đã hủy mã giảm giá')
  }

  const handleRemove = async (variantId: number) => {
    if (!session) {
      toast.error('Vui lòng đăng nhập để thực hiện thao tác này')
      return
    }

    try {
      setLoading(true)
      await removeCart(cartData?.id, variantId)
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!')

      const cartsRes = await getUserCarts(session.userId)

      const pending =
        cartsRes?.data?.filter(
          (item: UserCart) => item?.cart?.status === 'pending' || item?.cart?.status === 'not_decided'
        ) || []

      setPendingCarts(pending)

      if (pending.length > 0 && pending[0]?.cart) {
        const updatedCart = pending[0]?.cart
        setSelectedCart(updatedCart)
        if (appliedCoupon) {
          const newCartTotal = updatedCart.product_variants
            ? updatedCart.product_variants.reduce(
                (total: number, variant: any) => total + variant.price * variant.quantity,
                0
              )
            : 0

          let newDiscountAmount = 0
          if (appliedCoupon.discount_type === 'percentage') {
            newDiscountAmount = (newCartTotal * appliedCoupon.discount_value) / 100
          } else if (appliedCoupon.discount_type === 'fixed_amount') {
            newDiscountAmount = appliedCoupon.discount_value
          } else {
            newDiscountAmount = Number(appliedCoupon.discount_value || 0)
          }

          newDiscountAmount = Math.min(newDiscountAmount, newCartTotal)
          setDiscountAmount(newDiscountAmount)
        }
      } else {
        setSelectedCart(null)
        setAppliedCoupon(null)
        setDiscountAmount(0)
        setCouponCode('')
      }
    } catch (error) {
      toast.error('Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!pendingCarts.length || !pendingCarts[0]?.cart?.product_variants?.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 w-full">
        <p className="text-lg md:text-xl mb-6 text-center">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <Button
          onClick={handleBuyNow}
          disabled={processing}
          className="md:h-[60px] h-[50px] w-full max-w-[586px] bg-[#13D8A7] text-white px-6 py-2 rounded-full text-lg transition-colors"
        >
          {processing ? 'Đang xử lý...' : 'Mua ngay'}
        </Button>
      </div>
    )
  }

  const cartData = pendingCarts[0]?.cart
  const totalPrice = cartData?.product_variants
    ? cartData.product_variants
        .reduce((total: number, variant: any) => total + variant.price * variant.quantity, 0)
        .toLocaleString()
    : '0'

  return (
    <div className="xl:flex mt-10 w-full justify-between gap-20">
      <div className="w-full text-2xl mb-5 lg:mb-20">
        {cartData?.product_variants.map((variant: any, index: number) => (
          <div key={`menu-${index}`} className="flex justify-between items-center mb-5">
            <div className="flex justify-between items-center w-full gap-2 md:gap-5">
              <img src={variant.image_urls?.[0]} alt={variant.name || ''} className="aspect-square w-1/2 rounded-lg" />
              <div>
                <div className="font-medium text-sm lg:text-lg">{variant.name || 'Sản phẩm'}</div>
                {variant.size && <div className="text-[#737373] text-sm lg:text-lg">Size: {variant.size.size}</div>}
                {variant.color && <div className="text-[#737373] text-sm lg:text-lg">Color: {variant.color.name}</div>}
                <div className="flex gap-3 items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-white text-black border-[#737373] hover:bg-[#dbdbdb] h-8 w-10 lg:w-10 lg:h-10 text-sm lg:text-lg font-bold items-center flex border-2"
                      onClick={() => handleUpdateQuantity(variant.id, (variantQuantities[variant.id] || 1) - 1)}
                      disabled={quantityUpdating[variant.id]}
                    >
                      <MinusIcon />
                    </Button>
                    <Input
                      className="h-8 lg:h-10 w-16 lg:w-16 text-center border-2 border-[#737373] text-sm lg:text-lg font-bold pr-0 p-0"
                      min={1}
                      value={variantQuantities[variant.id] || 1}
                      onChange={(e) => handleUpdateQuantity(variant.id, Number(e.target.value) || 1)}
                      disabled={quantityUpdating[variant.id]}
                    />
                    <Button
                      className="bg-white text-black border-[#737373] hover:bg-[#dbdbdb] h-8 lg:h-10 w-10 lg:w-10 text-sm lg:text-lg font-bold items-center flex border-2"
                      onClick={() => handleUpdateQuantity(variant.id, (variantQuantities[variant.id] || 1) + 1)}
                      disabled={quantityUpdating[variant.id]}
                    >
                      <AddIcon />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center w-full">
              <div className="text-[#737373] w-full text-sm lg:text-lg text-right lg:text-center">
                <div className="text-sm lg:text-lg text-right md:text-center">
                  <span>{variant.price?.toLocaleString()}</span> VNĐ
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex gap-2 bg-transparent hover:bg-transparent shadow-none items-center justify-end p-0">
                    <BinIcon />
                    <p className="text-sm lg:text-lg text-[#DA1515] items-center">Xóa</p>
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
          </div>
        ))}
        <div className="flex justify-between mt-20">
          <div className="text-sm lg:text-lg">Tổng tiền</div>
          <div className="text-[#00C7BE] font-semibold text-lg lg:text-xl">{totalPrice} VNĐ</div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div className="text-sm lg:text-lg">Mã giảm giá</div>
          {appliedCoupon ? (
            <div className="flex items-center justify-between border border-[#13D8A7] rounded-md p-3">
              <div>
                <div className="font-medium text-lg lg:text-xl">{appliedCoupon.code}</div>
                <div className="text-xs text-[#737373]">
                  {appliedCoupon.discount_type === 'percentage'
                    ? `Giảm ${appliedCoupon.discount_value}%`
                    : `Giảm ${appliedCoupon.discount_value.toLocaleString()} VNĐ`}
                </div>
              </div>
              <Button
                onClick={handleRemoveCoupon}
                variant="ghost"
                className="text-[#DA1515] hover:text-[#DA1515] hover:bg-red-50"
              >
                Hủy
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                className="w-full"
                placeholder="Nhập mã giảm giá của bạn"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button
                onClick={handleApplyCoupon}
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="bg-[#13D8A7] hover:bg-[#11c296] text-white"
              >
                {isApplyingCoupon ? 'Đang áp dụng...' : 'Áp dụng'}
              </Button>
            </div>
          )}
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between mt-2">
            <div className="text-sm lg:text-lg">Giảm giá</div>
            <div className="text-[#DA1515] font-semibold text-lg lg:text-xl">
              -{discountAmount.toLocaleString()} VNĐ
            </div>
          </div>
        )}
      </div>
      {selectedCart ? (
        <FormDelivery cartData={selectedCart} discountAmount={discountAmount} couponCode={appliedCoupon?.code || ''} />
      ) : (
        <div className="mt-6 text-center text-gray-500">Đang tải thông tin...</div>
      )}
    </div>
  )
}

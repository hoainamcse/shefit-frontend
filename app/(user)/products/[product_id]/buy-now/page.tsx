'use client'

import { use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getCart, deleteCart, editCart, updateProductVariantQuantity } from '@/network/client/carts'
import { getProduct } from '@/network/client/products'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'
import { getUser } from '@/network/client/users'
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeftIcon } from 'lucide-react'
import { AddIcon } from '@/components/icons/AddIcon'
import { MinusIcon } from '@/components/icons/MinusIcon'
import { PROVINCES } from '@/lib/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Product, Variant } from '@/models/product'
import { getCoupons } from '@/network/server/coupons'

export default function BuyNowPage({ params }: { params: Promise<{ product_id: string }> }) {
  const { product_id } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { session } = useSession()

  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<any>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [productVariant, setProductVariant] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [quantityUpdating, setQuantityUpdating] = useState<Record<number, boolean>>({})
  const [variantQuantities, setVariantQuantities] = useState<Record<number, number>>({})
  const [coupons, setCoupons] = useState<any[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      address: '',
      shipping_fee: '0',
      total: '0',
      discount: '0',
      final_total: '0',
      payment_method: true,
      note: '',
    },
  })

  const selectedCity = form.watch('city')

  const calculateShippingFee = (weight: number, isHCM: boolean): number => {
    if (weight < 1) {
      return isHCM ? 17000 : 20000
    } else if (weight >= 1 && weight < 3) {
      return isHCM ? 20000 : 25000
    } else if (weight >= 3 && weight < 5) {
      return isHCM ? 25000 : 30000
    } else if (weight >= 5 && weight < 10) {
      return isHCM ? 30000 : 45000
    } else {
      const baseFee = isHCM ? 30000 : 45000
      const additionalWeight = Math.ceil(weight - 10)
      const additionalFee = additionalWeight * 5000
      return baseFee + additionalFee
    }
  }

  const calculateTotals = (cartData: any, city: string, discount: number) => {
    const cartTotal = cartData?.product_variants
      ? cartData.product_variants.reduce((total: number, variant: any) => {
          return total + variant.price * variant.quantity
        }, 0)
      : 0

    const isHCM = city?.includes('Hồ Chí Minh') || false
    const weight = cartData?.total_weight || 0
    const shippingFee = calculateShippingFee(weight, isHCM)
    const finalTotal = Math.max(0, cartTotal - discount) + shippingFee

    return {
      cartTotal,
      shippingFee,
      finalTotal,
      discount,
    }
  }

  useEffect(() => {
    if (cart) {
      const city = selectedCity || form.getValues('city')
      const { cartTotal, shippingFee, finalTotal, discount } = calculateTotals(cart, city, discountAmount)

      form.setValue('shipping_fee', shippingFee.toString(), { shouldValidate: true })
      form.setValue('total', cartTotal.toString(), { shouldValidate: true })
      form.setValue('discount', discount.toString(), { shouldValidate: true })
      form.setValue('final_total', finalTotal.toString(), { shouldValidate: true })
    }
  }, [selectedCity, cart, discountAmount, form])

  useEffect(() => {
    const fetchUser = async () => {
      if (session) {
        try {
          const userData = await getUser(session.userId)
          setUsername(userData?.data?.username || '')
        } catch (error) {
          console.error('Failed to fetch user:', error)
        }
      }
    }
    fetchUser()
  }, [session])

  async function handleSubmitOrder(formData: any) {
    if (!cartId || isSubmitting) return
    setIsSubmitting(true)

    try {
      const cartData = {
        user_name: formData.name,
        username: username || '',
        is_signed_up: !!session,
        telephone_number: formData.phone,
        city: formData.city,
        address: formData.address,
        total_weight: cart?.total_weight,
        shipping_fee: parseInt(formData.shipping_fee),
        total: parseInt(formData.total) + parseInt(formData.shipping_fee) - parseInt(formData.discount || '0'),
        coupon_code: couponCode,
        status: 'delivered',
        notes: formData.note,
        product_variant_ids: cart?.product_variants?.map((variant: any) => variant.id) || [],
      }

      await editCart(Number(cartId), cartData)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error('Đã xảy ra lỗi khi đặt hàng')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCancel() {
    if (!cartId || isDeleting) return
    setIsDeleting(true)
    try {
      await deleteCart(Number(cartId))
      toast.success('Đã hủy đơn hàng')
      router.push(`/products/${product_id}`)
    } catch (error) {
      console.error('Error deleting cart:', error)
      toast.error('Đã xảy ra lỗi khi hủy đơn hàng')
    } finally {
      setIsDeleting(false)
    }
  }

  const cartId = searchParams?.get('cart_id')

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return

      try {
        const userResponse = await getUser(session.userId)
        const userData = userResponse?.data

        if (userData) {
          const isHCM = userData.province?.includes('Hồ Chí Minh') || false
          const weight = cart?.total_weight || 0
          const shippingFee = calculateShippingFee(weight, isHCM)
          const cartTotal = cart?.product_variants
            ? cart.product_variants.reduce((total: number, variant: any) => total + variant.price * variant.quantity, 0)
            : 0

          form.reset({
            name: userData.fullname || userData.username || '',
            phone: userData.phone_number || '',
            city: userData.province || '',
            address: userData.address || '',
            shipping_fee: shippingFee.toString(),
            total: cartTotal.toString(),
            discount: discountAmount.toString(),
            final_total: (cartTotal + shippingFee - discountAmount).toString(),
            payment_method: true,
            note: '',
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [session, cart, form, discountAmount])

  const handleUpdateQuantity = async (variantId: number, newQuantity: number) => {
    if (!cartId) {
      toast.error('Không tìm thấy giỏ hàng')
      return
    }

    const validQuantity = Math.max(1, newQuantity)
    if (variantQuantities[variantId] === validQuantity) return

    try {
      setQuantityUpdating({ ...quantityUpdating, [variantId]: true })
      await updateProductVariantQuantity(Number(cartId), variantId, validQuantity)

      const cartResponse = await getCart(Number(cartId))
      const updatedCart = cartResponse.data

      setCart(updatedCart)
      setVariantQuantities({ ...variantQuantities, [variantId]: validQuantity })

      let newDiscountAmount = 0
      if (appliedCoupon) {
        const newCartTotal = updatedCart.product_variants
          ? updatedCart.product_variants.reduce(
              (total: number, variant: any) => total + variant.price * variant.quantity,
              0
            )
          : 0

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

      const city = form.getValues('city')
      const { cartTotal, shippingFee, finalTotal } = calculateTotals(updatedCart, city, newDiscountAmount)

      form.setValue('shipping_fee', shippingFee.toString(), { shouldValidate: true })
      form.setValue('total', cartTotal.toString(), { shouldValidate: true })
      form.setValue('discount', newDiscountAmount.toString(), { shouldValidate: true })
      form.setValue('final_total', finalTotal.toString(), { shouldValidate: true })

      toast.success('Đã cập nhật số lượng sản phẩm!')
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Không thể cập nhật số lượng. Vui lòng thử lại!')
    } finally {
      setQuantityUpdating({ ...quantityUpdating, [variantId]: false })
    }
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

      const cartTotal = cart?.product_variants
        ? cart.product_variants.reduce((total: number, variant: any) => total + variant.price * variant.quantity, 0)
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

      const city = form.getValues('city')
      const { shippingFee, finalTotal } = calculateTotals(cart, city, discount)

      form.setValue('discount', discount.toString(), { shouldValidate: true })
      form.setValue('final_total', finalTotal.toString(), { shouldValidate: true })

      toast.success(`Đã áp dụng mã giảm giá: ${matchingCoupon.code}`)
    } catch (error) {
      toast.error('Không thể áp dụng mã giảm giá. Vui lòng thử lại!')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setCouponCode('')

    if (cart) {
      const city = form.getValues('city')
      const { finalTotal } = calculateTotals(cart, city, 0)

      form.setValue('discount', '0', { shouldValidate: true })
      form.setValue('final_total', finalTotal.toString(), { shouldValidate: true })
    }
    toast.success('Đã hủy mã giảm giá')
  }

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

  useEffect(() => {
    async function loadData() {
      if (!cartId) {
        toast.error('Không tìm thấy giỏ hàng')
        router.push(`/products/${product_id}`)
        return
      }

      try {
        setLoading(true)
        const cartResponse = await getCart(Number(cartId))
        if (!cartResponse?.data) {
          toast.error('Không tìm thấy thông tin giỏ hàng')
          router.push(`/products/${product_id}`)
          return
        }

        const cartData = cartResponse.data
        setCart(cartData)

        if (cartData.product_variants && cartData.product_variants.length > 0) {
          const quantities: Record<number, number> = {}
          cartData.product_variants.forEach((variant: any) => {
            quantities[variant.id] = variant.quantity || 1
          })
          setVariantQuantities(quantities)
        }

        if (cartData.product_variants && cartData.product_variants.length > 0) {
          const variant = cartData.product_variants[0]
          setProductVariant(variant)

          const productResponse = await getProduct(variant.product_id.toString())
          if (productResponse?.data) {
            setProduct(productResponse.data)
          }
        } else if (cartData.items && cartData.items.length > 0) {
          const item = cartData.items[0]

          const productResponse = await getProduct(item.product_id.toString())
          if (productResponse?.data) {
            setProduct(productResponse.data)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Đã xảy ra lỗi khi tải dữ liệu')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [cartId, product_id, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!cart || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-lg">Không tìm thấy thông tin đơn hàng</div>
        <Button onClick={() => router.push(`/products/${product_id}`)} className="bg-[#13D8A7] hover:bg-[#11c296]">
          Quay lại trang sản phẩm
        </Button>
      </div>
    )
  }

  const cartItem =
    cart.product_variants && cart.product_variants.length > 0
      ? cart.product_variants[0]
      : cart.items && cart.items.length > 0
      ? cart.items[0]
      : null

  const variant =
    product?.variants && cartItem
      ? product.variants.find((v: Variant) => v.id === (cartItem.variant_id || cartItem.id))
      : null

  return (
    <div className="lg:p-10 p-4 mx-auto">
      <Dialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          setShowSuccessDialog(open)
          if (!open) {
            router.push(`/products/${product_id}`)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl xl:4xl text-center my-4">
              Đặt hàng thành công
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              NV CSKH sẽ liên hệ để xác nhận đơn hàng
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex mb-6 px-4">
        <Button
          onClick={handleCancel}
          disabled={isDeleting}
          className="bg-transparent shadow-none text-black text-lg hover:bg-transparent p-0"
        >
          <ArrowLeftIcon className="h-4 w-4" /> {isDeleting ? 'Đang hủy...' : 'Quay lại'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        <div className="w-full text-xl lg:mb-20 mb-4">
          {cart?.product_variants.map((variant: any, index: number) => (
            <div key={`menu-${index}`} className="flex justify-between items-center mb-5">
              <img
                src={variant.image_urls?.[0]}
                alt={variant.name || ''}
                className="lg:size-[148px] size-[85px] rounded-lg mr-5"
              />
              <div className="w-full">
                <div className="font-medium text-sm lg:text-lg">{variant.name || 'Sản phẩm'}</div>
                <div className="text-[#737373] text-sm lg:text-lg">Size: {variant.size?.size}</div>
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
                      type="number"
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
              <div className="text-[#737373] text-sm lg:text-lg w-full text-right">
                <div className="font-medium w-full">{variant.price?.toLocaleString()} VNĐ</div>
                {variant.color?.name && <div className="text-sm lg:text-lg mt-1">Màu: {variant.color.name}</div>}
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-4 justify-between mt-20">
            <div className="flex justify-between">
              <div className="text-sm lg:text-lg">Tổng tiền</div>
              <div className="text-[#00C7BE] font-semibold text-lg lg:text-xl">
                {cart?.product_variants
                  ? cart.product_variants
                      .reduce(
                        (total: number, variant: { price: number; quantity: number }) =>
                          total + variant.price * variant.quantity,
                        0
                      )
                      .toLocaleString()
                  : '0'}{' '}
                VNĐ
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-sm lg:text-lg">Mã giảm giá</div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between border border-[#13D8A7] rounded-md p-3">
                  <div>
                    <div className="font-medium">{appliedCoupon.code}</div>
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
              <div className="flex justify-between">
                <div className="text-sm lg:text-lg">Giảm giá</div>
                <div className="text-[#DA1515] font-semibold text-sm lg:text-lg">
                  -{discountAmount.toLocaleString()} VNĐ
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-2xl lg:text-4xl">
            Thông tin vận chuyển
          </div>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmitOrder)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm lg:text-lg">Tên</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên của bạn" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm lg:text-lg">Số điện thoại</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập số điện thoại của bạn" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm lg:text-lg">Thành phố</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.setValue('city', value, { shouldValidate: true })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thành phố" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROVINCES.map((province) => (
                            <SelectItem key={province.value} value={province.value}>
                              {province.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm lg:text-lg">Địa chỉ</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập địa chỉ của bạn" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="shipping_fee"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel className="text-sm lg:text-lg">Phí ship</FormLabel>
                    <FormControl>
                      <div className="text-[#8E8E93] text-sm lg:text-lg">
                        {parseInt(field.value || '0').toLocaleString('vi-VN')} <span>VNĐ</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="discount"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel className="text-sm lg:text-lg mt-2">Giảm giá</FormLabel>
                    <FormControl>
                      <div className="text-[#DA1515] text-sm lg:text-lg">
                        {parseInt(field.value || '0') > 0
                          ? `-${parseInt(field.value || '0').toLocaleString('vi-VN')}`
                          : '0'}{' '}
                        <span>VNĐ</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="final_total"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel className="text-sm lg:text-lg font-semibold">Tổng tiền</FormLabel>
                    <FormControl>
                      <div className="text-[#00C7BE] text-lg lg:text-xl font-semibold">
                        {parseInt(field.value || '0').toLocaleString('vi-VN')} <span>VNĐ</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="payment_method"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel className="text-sm lg:text-lg font-semibold mt-2">Phương thức</FormLabel>
                    <FormControl>
                      <div className="flex gap-2 items-center">
                        <div className="text-[#737373] text-lg lg:text-xl leading-8 items-center">
                          Thanh toán khi nhận hàng
                        </div>
                        <Checkbox className="size-8" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="note"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm lg:text-lg">Ghi chú thêm</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập ghi chú của bạn cho shop" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#13D8A7] hover:bg-[#11c296] rounded-full lg:h-16 h-11 text-sm lg:text-xl"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Mua ngay'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

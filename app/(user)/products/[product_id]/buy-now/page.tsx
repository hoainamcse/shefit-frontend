'use client'

import { use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getCart } from '@/network/server/cart'
import { getProduct } from '@/network/server/products'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteCart, editCart } from '@/network/server/cart'
import { useSession } from '@/components/providers/session-provider'
import { getUserById } from '@/network/server/user'
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeftIcon } from 'lucide-react'
import { PROVINCES } from '@/lib/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Variant {
  id: number
  product_id: number
  color_id: number
  size_id: number
  in_stock: boolean
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  price_currency: string
  image_urls: string[]
  variants: Variant[]
}

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

  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      address: '',
      shipping_fee: '0',
      total: cart?.total?.toString() || '0',
      payment_method: true,
      note: '',
    },
  })

  const selectedCity = form.watch('city')

  useEffect(() => {
    if (cart) {
      const isHCM = selectedCity?.includes('Hồ Chí Minh') || false
      const weight = cart.total_weight || 0
      const shippingFee = calculateShippingFee(weight, isHCM)
      const cartTotal = cart.total || 0

      form.setValue('shipping_fee', shippingFee.toString(), { shouldValidate: true })
      form.setValue('total', (cartTotal + shippingFee).toString(), { shouldValidate: true })
    }
  }, [selectedCity, cart, form])

  async function handleSubmitOrder(formData: any) {
    if (!cartId || isSubmitting) return
    setIsSubmitting(true)

    try {
      const cartData = {
        user_name: formData.name,
        username: session ? '' : formData.name,
        is_signed_up: !!session,
        telephone_number: formData.phone,
        city: formData.city,
        address: formData.address,
        total_weight: cart?.total_weight,
        shipping_fee: parseInt(formData.shipping_fee),
        total: parseInt(formData.total),
        status: 'delivered',
        payment_method: 'cod',
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

  const onSubmit = (data: any) => {
    console.log('Form Data:', data)
  }

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return

      try {
        const userResponse = await getUserById(session.userId)
        const userData = userResponse?.data

        if (userData) {
          const isHCM = userData.province?.includes('Hồ Chí Minh') || false
          const weight = cart?.total_weight
          const shippingFee = calculateShippingFee(weight, isHCM)

          form.reset({
            name: userData.fullname || userData.username || '',
            phone: userData.phone_number || '',
            city: userData.province || '',
            address: userData.address || '',
            shipping_fee: shippingFee.toString(),
            total: (cart?.total + shippingFee).toString(),
            note: '',
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [session, cart, form])

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
        <div className="text-xl">Đang tải...</div>
      </div>
    )
  }

  if (!cart || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="text-xl">Không tìm thấy thông tin đơn hàng</div>
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
    <div className="my-10 px-10 mx-auto">
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
            <DialogTitle className="font-[family-name:var(--font-coiny)] text-ring text-2xl xl:text-[40px] text-center my-4">
              Đặt hàng thành công
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              NV CSKH sẽ liên hệ để xác nhận đơn hàng
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex mb-6">
        <Button
          onClick={handleCancel}
          disabled={isDeleting}
          className="bg-transparent shadow-none text-black text-xl hover:bg-transparent"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> {isDeleting ? 'Đang hủy...' : 'Quay lại'}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full text-2xl max-lg:mb-20">
          {cart?.product_variants.map((variant: any, index: number) => (
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
              <div className="text-[#737373] text-2xl lg:text-xl text-right ml-auto min-w-[180px]">
                <div className="font-medium w-full">{variant.price?.toLocaleString()} VNĐ</div>
                {variant.color?.name && <div className="text-xl mt-1">Màu: {variant.color.name}</div>}
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-20">
            <div>Tổng tiền</div>
            <div className="text-[#00C7BE] font-semibold">{cart?.total?.toLocaleString()} VNĐ</div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5">
          <div className="font-[family-name:var(--font-coiny)] text-3xl">Thông tin vận chuyển</div>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmitOrder)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Tên</FormLabel>
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
                    <FormLabel className="text-xl">Số điện thoại</FormLabel>
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
                    <FormLabel className="text-xl">Thành phố</FormLabel>
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
                    <FormLabel className="text-xl">Địa chỉ</FormLabel>
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
                  <FormItem className="flex justify-between">
                    <FormLabel className="text-xl">Phí ship</FormLabel>
                    <FormControl>
                      <div className="text-[#8E8E93] text-xl">
                        {parseInt(field.value || '0').toLocaleString('vi-VN')} <span>VNĐ</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="total"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex justify-between">
                    <FormLabel className="text-xl font-semibold">Tổng tiền</FormLabel>
                    <FormControl>
                      <div className="text-[#00C7BE] text-2xl font-semibold">
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
                  <FormItem className="flex justify-between">
                    <FormLabel className="text-xl font-semibold">Phương thức</FormLabel>
                    <FormControl>
                      <div className="flex gap-2 item-center">
                        <div className="text-[#737373] text-xl leading-8 items-center">Thanh toán khi nhận hàng</div>
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
                    <FormLabel className="text-xl">Ghi chú thêm</FormLabel>
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
                className="w-full bg-[#13D8A7] hover:bg-[#11c296] rounded-full h-16 text-2xl"
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

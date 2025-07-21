'use client'

import { useState, useEffect } from 'react'
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { editCart } from '@/network/client/carts'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { PROVINCES } from '@/lib/label'
import { useSession } from '@/hooks/use-session'
import { getUser } from '@/network/client/users'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function FormDelivery({
  cartData,
  discountAmount = 0,
  couponCode = '',
}: {
  cartData: any
  discountAmount?: number
  couponCode?: string
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { session } = useSession()
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
    if (cartData) {
      const city = selectedCity || form.getValues('city')
      const { cartTotal, shippingFee, finalTotal, discount } = calculateTotals(cartData, city, discountAmount)

      form.setValue('shipping_fee', shippingFee.toString(), { shouldValidate: true })
      form.setValue('total', cartTotal.toString(), { shouldValidate: true })
      form.setValue('discount', discount.toString(), { shouldValidate: true })
      form.setValue('final_total', finalTotal.toString(), { shouldValidate: true })
    }
  }, [selectedCity, cartData, discountAmount, form])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return

      try {
        const userResponse = await getUser(session.userId)
        const userData = userResponse?.data

        if (userData) {
          const city = userData.province || ''
          const { cartTotal, shippingFee, finalTotal } = calculateTotals(cartData, city, discountAmount)

          form.reset({
            name: userData.fullname || userData.username || '',
            phone: userData.phone_number || '',
            city: city,
            address: userData.address || '',
            shipping_fee: shippingFee.toString(),
            total: cartTotal.toString(),
            discount: discountAmount.toString(),
            final_total: finalTotal.toString(),
            payment_method: true,
            note: '',
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [session, cartData, discountAmount, form])

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

  const handleSubmitOrder = async (formData: any) => {
    if (!cartData?.id || isSubmitting) return
    setIsSubmitting(true)

    try {
      const orderData = {
        user_name: formData.name,
        username: username || '',
        is_signed_up: !!session,
        telephone_number: formData.phone,
        city: formData.city,
        address: formData.address,
        total_weight: cartData?.total_weight,
        shipping_fee: parseInt(formData.shipping_fee),
        total: parseInt(formData.total) + parseInt(formData.shipping_fee) - parseInt(formData.discount || '0'),
        coupon_code: couponCode,
        status: 'delivered',
        notes: formData.note,
        product_variant_ids: cartData?.product_variants?.map((variant: any) => variant.id) || [],
      }

      await editCart(cartData.id, orderData)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Error submitting order:', error)
      toast.error('Đã xảy ra lỗi khi đặt hàng')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-3xl lg:text-4xl">
        Thông tin vận chuyển
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitOrder)} className="space-y-7">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base lg:text-xl">Tên</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập tên của bạn" className="text-base lg:text-xl" />
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
                <FormLabel className="text-base lg:text-xl">Số điện thoại</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập số điện thoại của bạn" className="text-base lg:text-xl" />
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
                <FormLabel className="text-base lg:text-xl">Thành phố</FormLabel>
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
                <FormLabel className="text-base lg:text-xl">Địa chỉ</FormLabel>
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
                <FormLabel className="text-base lg:text-xl">Phí ship</FormLabel>
                <FormControl>
                  <div className="text-[#8E8E93] text-base lg:text-xl">
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
                <FormLabel className="text-base lg:text-xl mt-2">Giảm giá</FormLabel>
                <FormControl>
                  <div className="text-[#DA1515] text-base lg:text-xl">
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
                <FormLabel className="text-base lg:text-xl font-semibold">Tổng tiền</FormLabel>
                <FormControl>
                  <div className="text-[#00C7BE] text-xl lg:text-2xl font-semibold">
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
                <FormLabel className="text-base lg:text-xl font-semibold mt-2">Phương thức</FormLabel>
                <FormControl>
                  <div className="flex gap-2 items-center">
                    <div className="text-[#737373] text-xl lg:text-2xl leading-8 items-center">
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
                <FormLabel className="text-base lg:text-xl">Ghi chú thêm</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nhập ghi chú của bạn cho shop" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#13D8A7] hover:bg-[#11c296] rounded-full lg:h-16 h-12 text-xl lg:text-2xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Mua ngay'}
          </Button>

          <Dialog
            open={showSuccessDialog}
            onOpenChange={(open) => {
              setShowSuccessDialog(open)
              if (!open) {
                window.location.href = 'account?tab=cart'
              }
            }}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl xl:text-[40px] text-center my-4">
                  Đặt hàng thành công
                </DialogTitle>
                <DialogDescription className="text-center text-lg">
                  NV CSKH sẽ liên hệ để xác nhận đơn hàng
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </div>
  )
}

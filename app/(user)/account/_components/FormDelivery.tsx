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
import router from 'next/router'

export default function FormDelivery({ cartData }: { cartData: any }) {
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const { session } = useSession()

  const form = useForm({
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      address: '',
      shipping_fee: cartData?.shipping_fee?.toString() || '0',
      total: cartData?.total?.toString() || '0',
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

  useEffect(() => {
    if (cartData) {
      const isHCM = selectedCity?.includes('Hồ Chí Minh') || false
      const weight = cartData.total_weight || 0
      const shippingFee = calculateShippingFee(weight, isHCM)
      const cartTotal = cartData.total - cartData.shipping_fee || 0

      form.setValue('shipping_fee', shippingFee.toString(), { shouldValidate: true })
      form.setValue('total', (cartTotal + shippingFee).toString(), { shouldValidate: true })
    }
  }, [selectedCity, cartData, form])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return

      try {
        const userResponse = await getUser(session.userId)
        const userData = userResponse?.data

        if (userData) {
          const isHCM = userData.province?.includes('Hồ Chí Minh') || false
          const weight = cartData?.total_weight || 0
          const shippingFee = calculateShippingFee(weight, isHCM)
          const cartTotal = cartData?.total - cartData?.shipping_fee || 0

          form.reset({
            name: userData.fullname || userData.username || '',
            phone: userData.phone_number || '',
            city: userData.province || '',
            address: userData.address || '',
            shipping_fee: shippingFee.toString(),
            total: (cartTotal + shippingFee).toString(),
            payment_method: true,
            note: '',
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [session, cartData, form])

  const handleSubmitOrder = async (formData: any) => {
    if (!cartData?.id || isSubmitting) return
    setIsSubmitting(true)

    try {
      const orderData = {
        user_name: formData.name,
        username: session ? '' : formData.name,
        is_signed_up: !!session,
        telephone_number: formData.phone,
        city: formData.city,
        address: formData.address,
        total_weight: cartData?.total_weight,
        shipping_fee: parseInt(formData.shipping_fee),
        total: parseInt(formData.total),
        status: 'delivered',
        payment_method: 'cod',
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
      <div className="font-[family-name:var(--font-coiny)] font-bold text-3xl">Thông tin vận chuyển</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitOrder)} className="space-y-7">
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
            name="address"
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
            className="w-full bg-[#13D8A7] hover:bg-[#11c296] rounded-full h-16 text-2xl"
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
                <DialogTitle className="font-[family-name:var(--font-coiny)] font-bold text-ring text-2xl xl:text-[40px] text-center my-4">
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

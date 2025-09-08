import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/components/ui/form'
import { MainButton } from '../buttons/main-button'
import { FormInputField, FormNumberField, FormSelectField } from './fields'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { createCoupon, updateCoupon } from '@/network/client/coupons'
import { Coupon } from '@/models/coupon'

const AVAILABLE_DISCOUNT_TYPE = [
  { value: 'percentage', label: 'Tỷ lệ phần trăm' },
  { value: 'fixed_amount', label: 'Số tiền cố định' },
  { value: 'membership_plan', label: 'Số ngày dùng thử' },
]

// Define the form schema
const formSchema = z.object({
  code: z.string().min(1, 'Mã không được để trống'),
  discount_type: z.enum(['percentage', 'fixed_amount', 'membership_plan']),
  discount_value: z.number().min(1, 'Giá trị không được để trống'),
  coupon_type: z.enum(['subscription', 'ecommerce']),
  max_usage: z.number().min(1).nullable(),
})

type CouponFormValue = z.infer<typeof formSchema>

interface CreateCouponFormProps {
  type: 'subscription' | 'ecommerce'
  onSuccess?: () => void
  data: Coupon | null
}

export function CreateCouponForm({ type, onSuccess, data }: CreateCouponFormProps) {
  const isEdit = !!data
  const [isPending, startTransition] = useTransition()

  const form = useForm<CouponFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          code: data.code || '',
          discount_type: (data.discount_type as 'percentage' | 'fixed_amount') || 'percentage',
          discount_value: data.discount_value ?? 0,
          coupon_type: (data.coupon_type as 'subscription' | 'ecommerce') || type,
          max_usage: data.max_usage,
        }
      : {
          code: '',
          discount_type: 'percentage',
          discount_value: 0,
          coupon_type: type,
          max_usage: null,
        },
  })

  const discountType = form.watch('discount_type')

  function onSubmit(values: CouponFormValue) {
    startTransition(async () => {
      try {
        if (!isEdit) {
          const couponResult = await createCoupon(values)
          if (couponResult.status === 'success') {
            toast.success('Tạo khuyến mãi thành công')
            onSuccess?.()
          }
        } else {
          const couponResult = await updateCoupon(values, data.id.toString())
          if (couponResult.status === 'success') {
            toast.success('Cập nhật khuyến mãi thành công')
            onSuccess?.()
          }
        }
      } catch (error: any) {
        toast.error(error.message || 'Tạo khuyến mãi thất bại')
      }
    })
  }

  const getDiscountValueDescription = () => {
    if (discountType === 'percentage') {
      return 'Đơn vị: %'
    } else if (discountType === 'fixed_amount') {
      return 'Đơn vị: đồng'
    } else if (discountType === 'membership_plan') {
      return 'Đơn vị: ngày'
    }
    return ''
  }

  const getAvailableDiscountType = () => {
    if (type === 'subscription') {
      return AVAILABLE_DISCOUNT_TYPE
    } else {
      return AVAILABLE_DISCOUNT_TYPE.filter((item) => item.value !== 'membership_plan')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInputField
          form={form}
          name="code"
          label="Mã khuyến mãi"
          withAsterisk
          placeholder="Nhập mã khuyến mãi"
          onChange={(e) => {
            const input = e.target as HTMLInputElement
            const formattedValue = input.value.replace(/\s+/g, '').toUpperCase()
            form.setValue('code', formattedValue)
          }}
        />

        <FormSelectField
          form={form}
          name="discount_type"
          label="Loại khuyến mãi"
          withAsterisk
          data={getAvailableDiscountType()}
          placeholder="Chọn loại khuyến mãi"
        />

        <FormNumberField
          form={form}
          name="discount_value"
          label="Giá trị"
          withAsterisk
          placeholder="Nhập giá trị"
          description={getDiscountValueDescription()}
        />

        <FormNumberField
          form={form}
          name="max_usage"
          label="Số lần sử dụng tối đa"
          placeholder="Nhập số lần sử dụng tối đa"
          description="Để trống nếu không giới hạn số lần sử dụng"
        />

        <MainButton
          text={isEdit ? 'Cập nhật khuyến mãi' : 'Tạo khuyến mãi'}
          type="submit"
          className="w-full"
          loading={isPending}
        />
      </form>
    </Form>
  )
}

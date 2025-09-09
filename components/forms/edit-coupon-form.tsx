'use client'

import type { Coupon } from '@/models/coupon'

import { z } from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCoupon, updateCoupon } from '@/network/client/coupons'

import { FormSelectField, FormInputField, FormNumberField } from './fields'
import { SubscriptionsTable } from '../data-table/subscriptions-table'
import { DialogEdit } from '../dialogs/dialog-edit'
import { MainButton } from '../buttons/main-button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Form } from '../ui/form'

const AVAILABLE_DISCOUNT_TYPE = [
  { value: 'percentage', label: 'Tỷ lệ phần trăm' },
  { value: 'fixed_amount', label: 'Số tiền cố định' },
  { value: 'membership_plan', label: 'Số ngày miễn phí' },
]

// Define the form schema
const formSchema = z.object({
  code: z.string().min(1, 'Mã không được để trống'),
  discount_type: z.enum(['percentage', 'fixed_amount', 'membership_plan']),
  discount_value: z.number().min(1, 'Giá trị không được để trống'),
  coupon_type: z.enum(['subscription', 'ecommerce']),
  max_usage: z.number().min(1).nullable(),
  max_usage_per_user: z.number().min(1).nullable(),
  subscription_ids: z.array(z.string()),
})

type FormValue = z.infer<typeof formSchema>

interface EditCouponFormProps {
  couponType: 'subscription' | 'ecommerce'
  data: Coupon | null
  onSuccess?: () => void
}

export function EditCouponForm({ couponType, onSuccess, data }: EditCouponFormProps) {
  const isEdit = !!data
  const defaultValue = {
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    coupon_type: couponType,
    max_usage: null,
    max_usage_per_user: null,
    subscription_ids: [],
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          code: data.code || '',
          discount_type: (data.discount_type as 'percentage' | 'fixed_amount') || 'percentage',
          discount_value: data.discount_value ?? 0,
          coupon_type: (data.coupon_type as 'subscription' | 'ecommerce') || couponType,
          max_usage: data.max_usage,
          max_usage_per_user: data.max_usage_per_user,
          subscription_ids: data.subscriptions.map((s) => s.id.toString()) || [],
        }
      : defaultValue,
  })

  const discountType = form.watch('discount_type')

  const couponMutation = useMutation({
    mutationFn: (values: any) => (isEdit ? updateCoupon(data.id, values) : createCoupon(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật khuyến mãi thành công' : 'Tạo khuyến mãi thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    couponMutation.mutate({ ...values, subscription_ids: values.subscription_ids.map((id) => Number(id)) })
  }

  const [openSubscriptionsTable, setOpenSubscriptionsTable] = useState(false)
  const [selectedSubscriptions, setSelectedSubscriptions] = useState(data?.subscriptions || [])

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
    if (couponType === 'subscription') {
      return AVAILABLE_DISCOUNT_TYPE
    } else {
      return AVAILABLE_DISCOUNT_TYPE.filter((item) => item.value !== 'membership_plan')
    }
  }

  return (
    <>
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
              form.setValue('code', formattedValue, { shouldDirty: true })
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

          <FormNumberField
            form={form}
            name="max_usage_per_user"
            label="Số lần sử dụng tối đa cho mỗi người dùng"
            placeholder="Nhập số lần sử dụng tối đa cho mỗi người dùng"
            description="Để trống nếu không giới hạn số lần sử dụng cho mỗi người dùng"
          />

          <div className="space-y-2">
            <Label>Gói tập (áp dụng)</Label>
            <div className="flex gap-2">
              <Input
                value={selectedSubscriptions.map((e) => e.name).join(', ')}
                onFocus={() => setOpenSubscriptionsTable(true)}
                placeholder="Chọn gói tập"
                readOnly
                className="flex-1"
              />
              {selectedSubscriptions.length > 0 && (
                <MainButton
                  text="Tất cả"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setSelectedSubscriptions([])
                    form.setValue('subscription_ids', [], { shouldDirty: true })
                    form.trigger('subscription_ids')
                  }}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Chọn một hoặc nhiều gói tập đã có hoặc tạo mới để liên kết với mã khuyến mãi này. Nếu bạn không chọn gói
              tập nào, mã khuyến mãi sẽ áp dụng cho tất cả các gói tập.
            </p>
          </div>

          <div className="flex justify-end">
            {(!isEdit || (isEdit && form.formState.isDirty)) && (
              <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={couponMutation.isPending} />
            )}
          </div>
        </form>
      </Form>
      <DialogEdit
        title="Chọn Gói tập"
        description="Chọn một hoặc nhiều gói tập đã có hoặc tạo mới để liên kết với khoá tập này."
        open={openSubscriptionsTable}
        onOpenChange={setOpenSubscriptionsTable}
      >
        <SubscriptionsTable
          onConfirmRowSelection={(row) => {
            setSelectedSubscriptions(row)
            form.setValue(
              'subscription_ids',
              row.map((r) => r.id.toString()),
              { shouldDirty: true }
            )
            form.trigger('subscription_ids')
            setOpenSubscriptionsTable(false)
          }}
        />
      </DialogEdit>
    </>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { MainButton } from '../buttons/main-button'
import { FormInputField, FormSelectField } from './fields'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { createCoupon } from '@/network/server/coupon'

const AVAILABLE_DISCOUNT_TYPE = [
  { value: 'percentage', label: 'Phần trăm' },
  { value: 'fixed_amount', label: 'Tiền mặt' },
]

// Define the form schema
const formSchema = z.object({
  code: z.string().min(1, 'Mã không được để trống'),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.coerce.number().min(1, 'Giá trị không được để trống'),
})

type CouponFormValue = z.infer<typeof formSchema>

interface CreateCouponFormProps {
  onSuccess?: () => void
}

export function CreateCouponForm({ onSuccess }: CreateCouponFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<CouponFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
    },
  })

  function onSubmit(values: CouponFormValue) {
    startTransition(async () => {
      try {
        const couponResult = await createCoupon(values)
        if (couponResult.status === 'success') {
          toast.success('Tạo khuyến mãi thành công')
          onSuccess?.()
        }
      } catch (error) {
        toast.error('Tạo khuyến mãi thất bại')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInputField form={form} name="code" label="Mã khuyến mãi" withAsterisk placeholder="Nhập mã khuyến mãi" />

        <FormSelectField
          form={form}
          name="discount_type"
          label="Loại khuyến mãi"
          withAsterisk
          data={AVAILABLE_DISCOUNT_TYPE}
          placeholder="Chọn loại khuyến mãi"
        />

        <FormInputField
          form={form}
          name="discount_value"
          label="Giá trị"
          withAsterisk
          placeholder="Nhập giá trị"
          description={form.getValues('discount_type') === 'percentage' ? 'Phần trăm (%)' : 'VNĐ'}
        />

        <MainButton text="Tạo khuyến mãi" type="submit" className="w-full" loading={isPending} />
      </form>
    </Form>
  )
}

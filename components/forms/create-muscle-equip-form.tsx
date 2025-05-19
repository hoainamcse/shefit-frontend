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
import { createCoupon, updateCoupon } from '@/network/server/coupon'
import { Coupon } from '@/models/coupon'
import { MuscleGroup } from '@/models/muscle-group'
import { FormImageInputField } from './fields/form-image-input-field'
import { Equipment } from '@/models/equipments'

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  image: z.string(),
})

type FormValue = z.infer<typeof formSchema>

interface CreateFormProps {
  onSuccess?: () => void
  isEdit?: boolean
  data?: MuscleGroup | Equipment
  type: 'muscle-groups' | 'equipments'
  create: (values: FormValue) => Promise<{ status: string }>
  update: (id: string, values: FormValue) => Promise<{ status: string }>
}

export function CreateMuscleEquipForm({ onSuccess, isEdit = false, data, create, update, type }: CreateFormProps) {
  const [isPending, startTransition] = useTransition()

  const entityLabel = type === 'muscle-groups' ? 'nhóm cơ' : 'dụng cụ'

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      name: '',
      image: '',
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      try {
        if (!isEdit) {
          const result = await create(values)
          console.log(result)
          if (result.status === 'success') {
            toast.success(`Tạo ${entityLabel} thành công`)
            onSuccess?.()
          }
        } else {
          if (data?.id) {
            const result = await update(data.id.toString(), values)
            if (result.status === 'success') {
              toast.success(`Cập nhật ${entityLabel} thành công`)
              onSuccess?.()
            }
          }
        }
      } catch (error) {
        toast.error(`Lưu ${entityLabel} thất bại`)
      }
    })
  })

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={onSubmit}>
        <FormInputField form={form} name="name" label="Tên" required placeholder="Nhập tên" />
        <div className="space-y-4">
          <FormLabel htmlFor="image">Hình ảnh</FormLabel>
          <FormImageInputField form={form} name="image" aria-label={`Tải hình ảnh ${entityLabel}`} id="image" />
        </div>
        <MainButton
          text={isEdit ? `Cập nhật ${entityLabel}` : `Tạo ${entityLabel}`}
          className="w-full"
          loading={isPending}
        />
      </form>
    </Form>
  )
}

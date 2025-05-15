import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { MainButton } from '../buttons/main-button'
import { FormInputField, FormSelectField, FormTextareaField } from './fields'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { createDiet, updateDiet } from '@/network/server/diet-admin'
import { Diet } from '@/models/diet-admin'

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  image: z.string().optional(),
  description: z.string().min(1, 'Mô tả không được để trống'),
})

type DietFormValue = z.infer<typeof formSchema>

interface CreateDietFormProps {
  onSuccess?: () => void
  isEdit?: boolean
  data?: Diet
}

export function CreateDietForm({ onSuccess, isEdit = false, data }: CreateDietFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<DietFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: data || {
      name: '',
      image: '',
      description: '',
    },
  })

  function onSubmit(values: DietFormValue) {
    startTransition(async () => {
      try {
        if (!isEdit) {
          const dietResult = await createDiet([values])
          if (dietResult.status === 'success') {
            toast.success('Tạo thực đơn thành công')
            onSuccess?.()
          }
        } else {
          if (data?.id) {
            const dietResult = await updateDiet(values, data.id)
            if (dietResult.status === 'success') {
              toast.success('Cập nhật thực đơn thành công')
              onSuccess?.()
            }
          }
        }
      } catch (error) {
        toast.error('Tạo khuyến mãi thất bại')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInputField form={form} name="name" label="Tên" withAsterisk placeholder="Nhập tên" />

        <FormTextareaField
          form={form}
          name="description"
          label="Mô tả"
          withAsterisk
          placeholder="Nhập mô tả"
          className="min-h-[150px]"
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

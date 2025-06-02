'use client'

import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createEquipment, updateEquipment } from '@/network/client/equipments'
import { Equipment } from '@/models/equipment'

import { FormImageInputField } from './fields/form-image-input-field'
import { MainButton } from '../buttons/main-button'
import { FormInputField } from './fields'
import { Form } from '../ui/form'

// ! Follow EquipmentPayload model in models/equipment.ts
const formSchema = z.object({
  name: z.string().min(1),
  image: z.string().nullable(),
})

type FormValue = z.infer<typeof formSchema>

interface EditEquipmentFormProps {
  data?: Equipment | null
  onSuccess?: () => void
}

export function EditEquipmentForm({ data, onSuccess }: EditEquipmentFormProps) {
  const isEdit = !!data
  const defaultValue = { name: '', image: null }

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          image: data.image,
        }
      : defaultValue,
  })

  const muscleGroupMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateEquipment(data.id, values) : createEquipment(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật dụng cụ thành công' : 'Tạo dụng cụ thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    muscleGroupMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="name" label="Tên dụng cụ" withAsterisk placeholder="Nhập tên dụng cụ" />
        <FormImageInputField form={form} name="image" label="Hình ảnh" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={muscleGroupMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

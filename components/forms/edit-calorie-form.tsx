'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCalorie, updateCalorie } from '@/network/client/calories'
import { Calorie } from '@/models/calorie'

import { FormInputField, FormMultiSelectField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

// ! Follow CaloriePayload model in models/calorie.ts
const formSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
})

type FormValue = z.infer<typeof formSchema>

interface EditCalorieFormProps {
  data?: Calorie | null
  onSuccess?: () => void
}

export function EditCalorieForm({ data, onSuccess }: EditCalorieFormProps) {
  const isEdit = !!data
  const defaultValue = { name: '', description: '' }

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          description: data.description,
        }
      : defaultValue,
  })

  const calorieMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateCalorie(data.id, values) : createCalorie(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật calorie thành công' : 'Tạo calorie thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    calorieMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="name" label="Tên calorie" withAsterisk placeholder="Nhập tên calorie" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={calorieMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

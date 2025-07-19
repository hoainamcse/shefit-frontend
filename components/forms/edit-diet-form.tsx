'use client'

import type { Diet } from '@/models/diet'

import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createDiet, updateDiet } from '@/network/client/diets'

import { FormInputField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'
import { ImageUploader } from '../image-uploader'

// ! Follow DietPayload model in models/diet.ts
const formSchema = z.object({
  name: z.string().min(1, 'Tên chế độ ăn không được để trống'),
  image: z.string().url(),
  description: z.string(),
})

type FormValue = z.infer<typeof formSchema>

interface EditDietFormProps {
  data: Diet | null
  onSuccess?: () => void
}

export function EditDietForm({ data, onSuccess }: EditDietFormProps) {
  const isEdit = !!data
  const defaultValue = { name: '', image: 'https://placehold.co/400/ffaeb0/white?text=shefit.vn&font=Oswald', description: '' } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          image: data.image,
          description: data.description,
        }
      : defaultValue,
  })

  const dietMutation = useMutation({
    mutationFn: async (values: FormValue) => {
      if (isEdit) {
        return updateDiet(data.id, values)
      } else {
        const response = await createDiet({ diets: [values] })
        return {
          ...response,
          data: Array.isArray(response.data) ? response.data[0] : response.data,
        }
      }
    },
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật chế độ ăn thành công' : 'Tạo chế độ ăn thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    dietMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="name" label="Tên chế độ ăn" withAsterisk placeholder="Nhập tên chế độ ăn" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <ImageUploader form={form} name="image" label="Hình ảnh" accept={{ 'image/*': [] }} maxFileCount={1} />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={dietMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

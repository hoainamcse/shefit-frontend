'use client'

import type { MuscleGroup } from '@/models/muscle-group'

import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createMuscleGroup, updateMuscleGroup } from '@/network/client/muscle-groups'

import { FormInputField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'
import { ImageUploader } from '../image-uploader'

// ! Follow MuscleGroupPayload model in models/muscle-group.ts
const formSchema = z.object({
  name: z.string().min(1, 'Tên nhóm cơ không được để trống'),
  image: z.string().url(),
})

type FormValue = z.infer<typeof formSchema>

interface EditMuscleGroupFormProps {
  data: MuscleGroup | null
  onSuccess?: () => void
}

export function EditMuscleGroupForm({ data, onSuccess }: EditMuscleGroupFormProps) {
  const isEdit = !!data
  const defaultValue = { name: '', image: 'https://placehold.co/400?text=shefit.vn&font=Oswald' }

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
    mutationFn: (values: FormValue) => (isEdit ? updateMuscleGroup(data.id, values) : createMuscleGroup(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật nhóm cơ thành công' : 'Tạo nhóm cơ thành công')
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
        <FormInputField form={form} name="name" label="Tên nhóm cơ" withAsterisk placeholder="Nhập tên nhóm cơ" />
        <ImageUploader form={form} name="image" label="Hình ảnh" accept={{ 'image/*': [] }} maxFileCount={1} />

        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={muscleGroupMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

'use client'

import type { Coach } from '@/models/coach'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCoach, updateCoach } from '@/network/client/coaches'

import { FormImageInputField, FormInputField, FormMultiSelectField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

// ! Follow CoachPayload model in models/coach.ts
const formSchema = z.object({
  name: z.string().min(1),
  image: z.string().url(),
  detail: z.string(),
  description: z.string(),
})

type FormValue = z.infer<typeof formSchema>

interface EditExerciseFormProps {
  data: Coach | null
  onSuccess?: () => void
}

export function EditCoachForm({ data, onSuccess }: EditExerciseFormProps) {
  const isEdit = !!data
  const defaultValue = {
    name: '',
    image: 'https://placehold.co/600x400?text=example',
    detail: '',
    description: '',
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          image: data.image,
          detail: data.detail,
          description: data.description,
        }
      : defaultValue,
  })

  const exerciseMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateCoach(data.id, values) : createCoach(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật HLV thành công' : 'Tạo HLV thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    exerciseMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="name" label="Tên HLV" withAsterisk placeholder="Nhập tên HLV" />
        <FormInputField form={form} name="detail" label="Chuyên môn" placeholder="Nhập chuyên môn" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <FormImageInputField form={form} name="image" label="Hình ảnh" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={exerciseMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createExercise, updateExercise } from '@/network/client/exercises'
import { Exercise } from '@/models/exercise'

import { FormInputField, FormMultiSelectField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

// ! Follow ExercisePayload model in models/exercise.ts
const formSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  youtube_url: z.string().url(),
  cover_image: z.string().url(),
  thumbnail_image: z.string().url(),
  muscle_group_ids: z.array(z.string()),
  equipment_ids: z.array(z.string()),
})

type FormValue = z.infer<typeof formSchema>

interface EditExerciseFormProps {
  data?: Exercise | null
  onSuccess?: () => void
}

export function EditExerciseForm({ data, onSuccess }: EditExerciseFormProps) {
  const isEdit = !!data
  const defaultValue = {
    name: '',
    description: '',
    youtube_url: '',
    cover_image: 'https://placehold.co/600x400?text=example',
    thumbnail_image: 'https://placehold.co/600x400?text=example',
    muscle_group_ids: [],
    equipment_ids: [],
  }

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          description: data.description,
          youtube_url: data.youtube_url,
          cover_image: data.cover_image,
          thumbnail_image: data.thumbnail_image,
          muscle_group_ids: data.muscle_groups.map((mg) => mg.id.toString()),
          equipment_ids: data.equipments.map((e) => e.id.toString()),
        }
      : defaultValue,
  })

  const exerciseMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateExercise(data.id, values) : createExercise(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật bài tập thành công' : 'Tạo bài tập thành công')
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
        <FormInputField form={form} name="name" label="Tên bài tập" withAsterisk placeholder="Nhập tên bài tập" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <FormMultiSelectField
          form={form}
          name="muscle_group_ids"
          label="Nhóm cơ IDs"
          placeholder="Nhập nhóm cơ ID"
          description="Nhập ID và nhấn enter để thêm"
        />
        <FormMultiSelectField
          form={form}
          name="equipment_ids"
          label="Dụng cụ IDs"
          placeholder="Nhập dụng cụ ID"
          description="Nhập ID và nhấn enter để thêm"
        />
        <FormInputField
          form={form}
          name="youtube_url"
          label="Link Youtube"
          placeholder="Nhập link Youtube"
          withAsterisk
        />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={exerciseMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

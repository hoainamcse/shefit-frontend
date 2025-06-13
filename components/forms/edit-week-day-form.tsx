'use client'

import type { Course, CourseWeek, WeekDay } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createWeekDay, updateWeekDay } from '@/network/client/courses'

import { FormNumberField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

// ! Follow WeekDayPayload model in models/course.ts
const formSchema = z.object({
  day_number: z.number().min(1),
  description: z.string(),
})

type FormValue = z.infer<typeof formSchema>

interface EditWeekDayFormProps {
  data: WeekDay | null
  onSuccess?: () => void
  courseID: Course['id']
  weekID: CourseWeek['id']
}

export function EditWeekDayForm({ data, onSuccess, courseID, weekID }: EditWeekDayFormProps) {
  const isEdit = !!data
  const defaultValue = { day_number: 1, description: '' } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit ? { day_number: data.day_number, description: data.description } : defaultValue,
  })

  const weekDayMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit ? updateWeekDay(courseID, weekID, data.id, values) : createWeekDay(courseID, weekID, values),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật ngày thành công' : 'Tạo ngày thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    weekDayMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormNumberField form={form} name="day_number" label="Thứ tự ngày" placeholder="Nhập thứ tự ngày" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={weekDayMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

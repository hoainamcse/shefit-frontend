'use client'

import type { Course, CourseWeek } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCourseWeek, updateCourseWeek } from '@/network/client/courses'

import { MainButton } from '../buttons/main-button'
import { FormNumberField } from './fields'
import { Form } from '../ui/form'

// ! Follow CourseWeekPayload model in models/course.ts
const formSchema = z.object({
  week_number: z.number().min(1),
})

type FormValue = z.infer<typeof formSchema>

interface EditCourseWeekFormProps {
  data: CourseWeek | null
  onSuccess?: () => void
  courseID: Course['id']
}

export function EditCourseWeekForm({ data, onSuccess, courseID }: EditCourseWeekFormProps) {
  const isEdit = !!data
  const defaultValue = { week_number: 1 } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit ? { week_number: data.week_number } : defaultValue,
  })

  const courseWeekMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit ? updateCourseWeek(courseID, data.id, values) : createCourseWeek(courseID, values),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật tuần thành công' : 'Tạo tuần thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    courseWeekMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormNumberField form={form} name="week_number" label="Thứ tự tuần" placeholder="Nhập thứ tự tuần" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={courseWeekMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

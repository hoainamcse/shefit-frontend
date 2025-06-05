'use client'

import type { CourseLive } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createCourseLive, updateCourseLive } from '@/network/client/courses'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { FormSelectField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { TimePicker } from '../time-picker'

// ! Follow CourseLivePayload model in models/course.ts
const formSchema = z.object({
  day_of_week: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  start_time: z.string(),
  end_time: z.string(),
  description: z.string(),
})

type FormValue = z.infer<typeof formSchema>

interface EditCourseLiveFormProps {
  data: CourseLive | null
  courseID: CourseLive['id']
  onSuccess?: () => void
}

export function EditCourseLiveForm({ data, courseID, onSuccess }: EditCourseLiveFormProps) {
  const isEdit = !!data
  const defaultValue = {
    day_of_week: 'Monday',
    start_time: '09:00',
    end_time: '11:00',
    description: '',
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          day_of_week: data.day_of_week,
          start_time: data.start_time,
          end_time: data.end_time,
          description: data.description,
        }
      : defaultValue,
  })

  const exerciseMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit ? updateCourseLive(courseID, data.id, values) : createCourseLive(courseID, values),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật phiên học thành công' : 'Tạo phiên học thành công')
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
        <FormSelectField
          form={form}
          name="day_of_week"
          label="Ngày trong tuần"
          placeholder="Chọn ngày trong tuần"
          data={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bắt đầu</FormLabel>
                <FormControl>
                  <TimePicker value={field.value} onChange={field.onChange} format="24" className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kết thúc</FormLabel>
                <FormControl>
                  <TimePicker value={field.value} onChange={field.onChange} format="24" className="w-full" />
                </FormControl>
                {/* <FormDescription /> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={exerciseMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

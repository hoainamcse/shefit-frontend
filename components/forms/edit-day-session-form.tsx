'use client'

import type { LiveDay, DaySession, Course } from '@/models/course'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createDaySession, updateDaySession } from '@/network/client/courses'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { FormInputField, FormNumberField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { TimePicker } from '../time-picker'

// ! Follow DaySessionPayload model in models/course.ts
const formSchema = z.object({
  session_number: z.number().min(1),
  name: z.string().min(1, 'Tên session không được để trống'),
  description: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  link_zoom: z.string().url('Link Zoom không hợp lệ'),
})

type FormValue = z.infer<typeof formSchema>

interface EditDaySessionFormProps {
  data: DaySession | null
  courseID: Course['id']
  liveDayID: LiveDay['id']
  onSuccess?: () => void
}

export function EditDaySessionForm({ data, courseID, liveDayID, onSuccess }: EditDaySessionFormProps) {
  const isEdit = !!data
  const defaultValue = {
    session_number: 1,
    name: '',
    description: '',
    start_time: '09:00',
    end_time: '10:00',
    link_zoom: '',
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          session_number: data.session_number,
          name: data.name,
          description: data.description,
          start_time: data.start_time,
          end_time: data.end_time,
          link_zoom: data.link_zoom,
        }
      : defaultValue,
  })

  const daySessionMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit ? updateDaySession(courseID, liveDayID, data.id, values) : createDaySession(courseID, liveDayID, values),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật session thành công' : 'Tạo session thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    daySessionMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormNumberField
          form={form}
          name="session_number"
          label="Thứ tự session"
          placeholder="Nhập thứ tự session"
        />
        <FormInputField form={form} name="name" label="Tên session" withAsterisk placeholder="Nhập tên session" />
        <FormInputField form={form} name="link_zoom" label="Link Zoom" placeholder="Nhập link Zoom" withAsterisk />
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
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={daySessionMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

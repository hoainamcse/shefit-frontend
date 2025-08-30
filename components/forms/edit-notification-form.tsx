'use client'

import type { Notification } from '@/models/notification'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { createNotification, updateNotification } from '@/network/client/notifications'
import { FormInputField, FormRichTextField, FormSwitchField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

// Based on NotificationPayload model in models/notification.ts
const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề thông báo không được để trống'),
  content: z.string().min(1, 'Nội dung thông báo không được để trống'),
  notify_date: z.string(),
  pinned: z.boolean().default(false),
})

type FormValue = z.infer<typeof formSchema>

interface EditNotificationFormProps {
  data?: Notification
}

export function EditNotificationForm({ data }: EditNotificationFormProps) {
  const router = useRouter()
  const isEdit = !!data
  const currentDate = new Date().toISOString().split('T')[0]

  const defaultValue = {
    title: '',
    content: '',
    notify_date: currentDate,
    pinned: false,
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: data.title,
          content: data.content,
          notify_date: new Date(data.notify_date).toISOString().split('T')[0],
          pinned: data.pinned,
        }
      : defaultValue,
  })

  const notificationMutation = useMutation({
    mutationFn: (values: any) => (isEdit ? updateNotification(data.id, values) : createNotification(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật thông báo thành công' : 'Tạo thông báo thành công')
        router.push(`/admin/notifications`)
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    notificationMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField
          form={form}
          name="title"
          label="Tiêu đề thông báo"
          withAsterisk
          placeholder="Nhập tiêu đề thông báo"
        />
        <FormRichTextField
          form={form}
          name="content"
          label="Nội dung thông báo"
          withAsterisk
          placeholder="Nhập nội dung thông báo"
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInputField form={form} name="notify_date" label="Ngày thông báo" withAsterisk type="date" />
          <FormSwitchField
            form={form}
            name="pinned"
            label="Ghim thông báo"
            description="Thông báo ghim sẽ hiển thị ở đầu danh sách"
          />
        </div>
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={notificationMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

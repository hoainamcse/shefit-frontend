'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { Form } from '@/components/ui/form'
import { Topic } from '@/models/topic'
import { createTopic, updateTopic } from '@/network/client/topics'
import { MainButton } from '../buttons/main-button'
import { FormInputField } from './fields'

const formSchema = z.object({
  name: z.string().min(1, 'Tên chủ đề không được để trống'),
})

type FormValue = z.infer<typeof formSchema>

interface EditTopicFormProps {
  data: Topic | null
  onSuccess: () => void
}

export function EditTopicForm({ data, onSuccess }: EditTopicFormProps) {
  const isEdit = !!data
  const defaultValue = { name: '' } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
        }
      : defaultValue,
  })

  const topicMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateTopic(data.id, values) : createTopic(values)),
    onSettled(data, error) {
      if (data) {
        toast.success(isEdit ? 'Cập nhật chủ đề thành công' : 'Tạo chủ đề thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    topicMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField
          form={form}
          name="name"
          label="Tên chủ đề"
          withAsterisk
          placeholder="Nhập tên chủ đề"
        />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={topicMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

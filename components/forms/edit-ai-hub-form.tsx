'use client'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { createGreeting, updateGreeting } from '@/network/client/chatbot'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'
import { Greeting } from '@/models/chatbot'
import { FormRadioField, FormTextareaField } from './fields'

// ! Follow CoachPayload model in models/coach.ts
const formSchema = z.object({
  message: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  prompt: z.string(),
})

type FormValue = z.infer<typeof formSchema>

interface EditAIHubFormProps {
  data: Greeting | null
  onSuccess?: () => void
}

export function EditAIHubForm({ data, onSuccess }: EditAIHubFormProps) {
  const isEdit = !!data
  const defaultValue = {
    message: '',
    status: 'ACTIVE',
    prompt: '',
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          message: data.message,
          status: data.status,
          prompt: data.prompt,
        }
      : defaultValue,
  })

  const exerciseMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateGreeting(data.id, values) : createGreeting(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật câu hỏi thành công' : 'Tạo câu hỏi thành công')
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
        <FormTextareaField form={form} name="message" label="Nội dung" placeholder="Nhập nội dung" />
        <FormTextareaField form={form} name="prompt" label="Prompt" placeholder="Nhập prompt" />
        <FormRadioField
          form={form}
          name="status"
          label="Trạng thái"
          data={[
            { value: 'ACTIVE', label: 'Hoạt động' },
            { value: 'INACTIVE', label: 'Không hoạt động' },
          ]}
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

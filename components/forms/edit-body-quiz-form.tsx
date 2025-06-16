'use client'

import type { BodyQuiz } from '@/models/body-quiz'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createBodyQuiz, updateBodyQuiz } from '@/network/client/body-quizzes'

import { FormInputField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

// ! Follow BodyQuizPayload model in models/body-quiz.ts
const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề quiz không được để trống'),
  description: z.string(),
  question_ids: z.array(z.string()),
})

type FormValue = z.infer<typeof formSchema>

interface EditBodyQuizFormProps {
  data: BodyQuiz | null
  onSuccess?: () => void
}

export function EditBodyQuizForm({ data, onSuccess }: EditBodyQuizFormProps) {
  const isEdit = !!data
  const defaultValue = { title: '', description: '', question_ids: [] } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: data.title,
          description: data.description,
          question_ids: data.questions.map((q) => q.id.toString()),
        }
      : defaultValue,
  })

  const bodyQuizMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateBodyQuiz(data.id, values) : createBodyQuiz(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật quiz thành công' : 'Tạo quiz thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    bodyQuizMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="title" label="Tiêu đề quiz" withAsterisk placeholder="Nhập tiêu đề quiz" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={bodyQuizMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

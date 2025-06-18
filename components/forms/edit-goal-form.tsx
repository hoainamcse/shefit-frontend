'use client'

import type { Goal } from '@/models/goal'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createGoal, updateGoal } from '@/network/client/goals'

import { FormInputField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

const formSchema = z.object({
  name: z.string().min(1, 'Tên mục tiêu không được để trống'),
})

type FormValue = z.infer<typeof formSchema>

interface EditGoalFormProps {
  data: Goal | null
  onSuccess?: () => void
}

export function EditGoalForm({ data, onSuccess }: EditGoalFormProps) {
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

  const goalMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateGoal(data.id, values) : createGoal(values)),
    onSettled(data, error) {
      if (data) {
        toast.success(isEdit ? 'Cập nhật mục tiêu thành công' : 'Tạo mục tiêu thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    goalMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="name" label="Tên mục tiêu" withAsterisk placeholder="Nhập tên mục tiêu" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={goalMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

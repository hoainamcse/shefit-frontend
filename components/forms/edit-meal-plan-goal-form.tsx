'use client'

import type { MealPlanGoal } from '@/models/meal-plan-goal'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createMealPlanGoal, updateMealPlanGoal } from '@/network/client/meal-plan-goals'

import { FormInputField, FormTextareaField } from './fields'
import { MainButton } from '../buttons/main-button'
import { Form } from '../ui/form'

const formSchema = z.object({
  name: z.string().min(1, 'Tên mục tiêu không được để trống'),
})

type FormValue = z.infer<typeof formSchema>

interface EditMealPlanGoalFormProps {
  data: MealPlanGoal | null
  onSuccess?: () => void
}

export function EditMealPlanGoalForm({ data, onSuccess }: EditMealPlanGoalFormProps) {
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
    mutationFn: (values: FormValue) => (isEdit ? updateMealPlanGoal(data.id, values) : createMealPlanGoal(values)),
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

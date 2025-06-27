'use client'

import type { MealPlan, MealPlanDay, MealPlanDish } from '@/models/meal-plan'

import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createMealPlanDish, updateMealPlanDish } from '@/network/client/meal-plans'
import { MainButton } from '@/components/buttons/main-button'
import { dishMealTimeOptions } from '@/lib/label'
import { Form } from '@/components/ui/form'

import { FormInputField, FormNumberField, FormSelectField, FormTextareaField } from './fields'

// ! Follow MealPlanDishPayload model in models/meal-plan.ts
export const formSchema = z.object({
  name: z.string().min(1, 'Tên món ăn không được để trống'),
  description: z.string(),
  nutrients: z.string(),
  meal_time: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
})

export type FormValue = z.infer<typeof formSchema>

type EditMealPlanDishFormProps = {
  data: MealPlanDish | null
  dayID: MealPlanDay['id']
  mealPlanID: MealPlan['id']
  onSuccess?: () => void
}

export function EditMealPlanDishForm({ data, mealPlanID, dayID, onSuccess }: EditMealPlanDishFormProps) {
  const isEdit = !!data
  const defaultValue = {
    name: '',
    description: '',
    nutrients: '',
    meal_time: 'breakfast',
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          name: data.name,
          description: data.description,
          nutrients: data.nutrients,
          meal_time: data.meal_time,
        }
      : defaultValue,
  })

  const mealPlanDishMutation = useMutation({
    mutationFn: (values: FormValue) =>
      isEdit ? updateMealPlanDish(mealPlanID, dayID, data.id, values) : createMealPlanDish(mealPlanID, dayID, values),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật món ăn thành công' : 'Tạo món ăn thành công')
        onSuccess?.()
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    mealPlanDishMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="name" label="Tên món ăn" withAsterisk placeholder="Nhập tên món ăn" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <FormSelectField
          form={form}
          name="meal_time"
          label="Thời gian ăn"
          placeholder="Chọn thời gian ăn"
          data={dishMealTimeOptions}
        />
        <FormTextareaField form={form} name="nutrients" label="Dinh dưỡng" placeholder="Nhập dinh dưỡng" />
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={mealPlanDishMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

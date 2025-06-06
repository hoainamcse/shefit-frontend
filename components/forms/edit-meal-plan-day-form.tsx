'use client'

import type { MealPlan, MealPlanDay } from '@/models/meal-plan'

import z from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createMealPlanDay, updateMealPlanDay } from '@/network/client/meal-plans'
import { MainButton } from '@/components/buttons/main-button'
import { Form } from '@/components/ui/form'

import { FormNumberField } from './fields'
import { ImageUploader } from '../image-uploader'

// ! Follow MealPlanDayPayload model in models/meal-plan.ts
export const formSchema = z.object({
  day_number: z.number().min(1),
  image: z.string().url(),
})

export type FormValue = z.infer<typeof formSchema>

type EditMealPlanDayFormProps = {
  data: MealPlanDay | null
  mealPlanID: MealPlan['id']
  onSuccess?: () => void
}

export function EditMealPlanDayForm({ data, mealPlanID, onSuccess }: EditMealPlanDayFormProps) {
  const isEdit = !!data
  const defaultValue = { day_number: 1, image: 'https://placehold.co/600x400?text=example' } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          day_number: data.day_number,
          image: data.image,
        }
      : defaultValue,
  })

  const mealPlanDayMutation = useMutation({
    mutationFn: async (values: FormValue) => {
      if (isEdit) {
        return updateMealPlanDay(mealPlanID, data.id, values)
      } else {
        const response = await createMealPlanDay(mealPlanID, values)
        return {
          ...response,
          data: Array.isArray(response.data) ? response.data[0] : response.data,
        }
      }
    },
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
    mealPlanDayMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormNumberField form={form} name="day_number" label="Thứ tự ngày" placeholder="Nhập thứ tự ngày" />
        <ImageUploader form={form} name="image" label="Hình ảnh" accept={{ 'image/*': [] }} maxFileCount={1} />

        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={mealPlanDayMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}

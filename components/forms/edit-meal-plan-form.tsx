'use client'

import type { MealPlan } from '@/models/meal-plan'

import { z } from 'zod'
import { toast } from 'sonner'
import { Trash2Icon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'

import { createMealPlan, updateMealPlan } from '@/network/client/meal-plans'
import { mealPlanGoalOptions } from '@/lib/label'

import { MainButton } from '../buttons/main-button'
import { AddButton } from '../buttons/add-button'
import { Label } from '../ui/label'
import { Form } from '../ui/form'
import { FormInputField, FormNumberField, FormSelectField, FormSwitchField, FormTextareaField } from './fields'
import { ImageUploader } from '../image-uploader'

// ! Follow MealPlanPayload model in models/meal-plan.ts
const formSchema = z.object({
  title: z.string().min(1, 'Tiêu đề thực đơn không được để trống'),
  subtitle: z.string(),
  chef_name: z.string(),
  goal: z.enum(['weight_loss', 'energy', 'recovery', 'hormonal_balance', 'muscle_tone']),
  image: z.string().url(),
  youtube_url: z.string().url('Link Youtube không hợp lệ'),
  description: z.string(),
  meal_ingredients: z.array(
    z.object({
      name: z.string().min(1),
      image: z.string().url(),
    })
  ),
  is_public: z.boolean(),
  is_free: z.boolean(),
  free_days: z.number().min(0),
  diet_id: z.number().nullable(),
  calorie_id: z.number().nullable(),
})

type FormValue = z.infer<typeof formSchema>

interface EditMealPlanFormProps {
  data?: MealPlan
  onSuccess?: (data: MealPlan) => void
}

export function EditMealPlanForm({ data, onSuccess }: EditMealPlanFormProps) {
  const isEdit = !!data
  const defaultValue = {
    title: '',
    subtitle: '',
    chef_name: '',
    goal: 'weight_loss',
    image: 'https://placehold.co/600x400?text=example',
    youtube_url: '',
    description: '',
    meal_ingredients: [],
    is_public: true,
    is_free: false,
    free_days: 0,
    calorie_id: null,
    diet_id: null,
  } as FormValue

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          title: data.title,
          subtitle: data.subtitle,
          chef_name: data.chef_name,
          goal: data.goal,
          image: data.image,
          youtube_url: data.youtube_url,
          description: data.description,
          meal_ingredients: data.meal_ingredients,
          is_public: data.is_public,
          is_free: data.is_free,
          free_days: data.free_days,
          calorie_id: data.calorie?.id || null,
          diet_id: data.diet?.id || null,
        }
      : defaultValue,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'meal_ingredients',
  })

  const mealPlanMutation = useMutation({
    mutationFn: (values: FormValue) => (isEdit ? updateMealPlan(data.id, values) : createMealPlan(values)),
    onSettled(data, error) {
      if (data?.status === 'success') {
        toast.success(isEdit ? 'Cập nhật thực đơn thành công' : 'Tạo thực đơn thành công')
        onSuccess?.(data.data)
      } else {
        toast.error(error?.message || 'Đã có lỗi xảy ra')
      }
    },
  })

  const onSubmit = (values: FormValue) => {
    mealPlanMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField form={form} name="title" label="Tên thực đơn" withAsterisk placeholder="Nhập tên thực đơn" />
        <FormTextareaField form={form} name="subtitle" label="Tóm tắt" placeholder="Nhập tóm tắt" />
        <FormTextareaField form={form} name="description" label="Mô tả" placeholder="Nhập mô tả" />
        <div className="grid grid-cols-2 gap-4">
          <FormInputField form={form} name="chef_name" label="Tên đầu bếp" placeholder="Nhập tên đầu bếp" />
          <FormSelectField
            form={form}
            name="goal"
            label="Mục tiêu"
            placeholder="Chọn mục tiêu"
            data={mealPlanGoalOptions}
          />
        </div>
        <ImageUploader form={form} name="image" label="Hình ảnh" accept={{ 'image/*': [] }} maxFileCount={1} />
        <FormInputField form={form} name="youtube_url" label="Link Youtube" placeholder="Nhập link Youtube" />
        <div className="grid grid-cols-2 gap-4">
          <FormSelectField form={form} name="diet_id" label="Chế độ ăn" placeholder="Chọn chế độ ăn" />
          <FormSelectField form={form} name="calorie_id" label="Calorie" placeholder="Chọn calorie" />
        </div>
        <div className="border border-dashed p-4 rounded-md space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Thành phần nguyên liệu</Label>
            <AddButton
              size="sm"
              type="button"
              variant="outline"
              text="Thêm nguyên liệu"
              onClick={() => append({ name: '', image: 'https://placehold.co/600x400?text=example' })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-ring border-dashed rounded-md space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Nguyên liệu {index + 1}</Label>
                  <MainButton
                    size="icon"
                    variant="outline"
                    icon={Trash2Icon}
                    onClick={() => remove(index)}
                    className="hover:text-destructive"
                  />
                </div>
                <div className="space-y-4">
                  <FormInputField
                    form={form}
                    name={`meal_ingredients.${index}.name`}
                    label={`Tên nguyên liệu`}
                    placeholder="Nhập tên nguyên liệu"
                    withAsterisk
                  />

                  <ImageUploader
                    form={form}
                    name={`meal_ingredients.${index}.image`}
                    label={`Hình ảnh`}
                    accept={{ 'image/*': [] }}
                    maxFileCount={1}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormSwitchField
            form={form}
            name="is_public"
            label="Công khai"
            description="Bật khi muốn thực đơn này hiển thị công khai"
          />
          <FormSwitchField
            form={form}
            name="is_free"
            label="Miễn phí"
            description="Bật khi muốn thực đơn này miễn phí cho người dùng"
          />
          <FormNumberField form={form} name="free_days" label="Số ngày miễn phí" placeholder="e.g., 10" />
        </div>
        <div className="flex justify-end">
          {(!isEdit || (isEdit && form.formState.isDirty)) && (
            <MainButton text={isEdit ? `Cập nhật` : `Tạo mới`} loading={mealPlanMutation.isPending} />
          )}
        </div>
      </form>
    </Form>
  )
}
